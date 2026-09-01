import os

import boto3
from dotenv import load_dotenv


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")
KNOWLEDGE_BASE_MODEL_ARN = os.getenv(
    "KNOWLEDGE_BASE_MODEL_ARN"
)


# =========================================================
# CLIENT UNTUK KNOWLEDGE BASE
# =========================================================

kb_client = boto3.client(
    "bedrock-agent-runtime",
    region_name=AWS_REGION,
)


# =========================================================
# CLIENT UNTUK AMAZON BEDROCK / NOVA
# =========================================================

bedrock_client = boto3.client(
    "bedrock-runtime",
    region_name=AWS_REGION,
)


# =========================================================
# CLIENT UNTUK AMAZON S3
# =========================================================

s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
)


# =========================================================
# BUAT PRESIGNED URL UNTUK SOURCE DOCUMENT
# =========================================================

def create_presigned_url(uri: str):
    """
    Mengubah S3 URI atau S3 HTTPS URL menjadi temporary
    presigned URL yang dapat dibuka oleh browser tanpa
    membuat bucket menjadi public.

    Mendukung dua format input:
      - s3://bucket-name/folder/file.pdf
      - https://bucket-name.s3.region.amazonaws.com/folder/file.pdf

    URL berlaku selama 1 jam.
    """

    # -----------------------------------------------------
    # Validasi URI
    # -----------------------------------------------------

    print(f"[PRESIGNED] Input URI: {uri!r}")

    if not uri:
        print("[PRESIGNED] URI kosong, return None")
        return None

    try:

        bucket = None
        key = None

        # -------------------------------------------------
        # Format 1: s3://bucket/key
        # -------------------------------------------------

        if uri.startswith("s3://"):

            s3_path = uri[5:]
            parts = s3_path.split("/", 1)

            print(f"[PRESIGNED] Format: s3:// — parts: {parts}")

            if len(parts) != 2:
                print(f"[PRESIGNED] Gagal memisahkan bucket/key dari s3://. parts={parts}")
                return None

            bucket = parts[0]
            key = parts[1]

        # -------------------------------------------------
        # Format 2: https://bucket.s3.region.amazonaws.com/key
        # -------------------------------------------------

        elif "amazonaws.com" in uri:

            # Hilangkan prefix https://
            without_scheme = uri.replace("https://", "").replace("http://", "")

            # Pisahkan host dan path
            # without_scheme = "bucket.s3.region.amazonaws.com/folder/file.pdf"
            slash_pos = without_scheme.find("/")

            if slash_pos == -1:
                print(f"[PRESIGNED] Tidak ada path setelah host. URI: {uri!r}")
                return None

            host = without_scheme[:slash_pos]
            key = without_scheme[slash_pos + 1:]

            # Ambil bucket dari subdomain: "bucket.s3.region.amazonaws.com"
            bucket = host.split(".")[0]

            print(f"[PRESIGNED] Format: HTTPS — host: {host!r}, bucket: {bucket!r}, key: {key!r}")

        else:

            print(f"[PRESIGNED] Format URI tidak dikenali: {uri!r}")
            return None

        # -------------------------------------------------
        # Validasi bucket dan key
        # -------------------------------------------------

        if not bucket or not key:
            print(f"[PRESIGNED] Bucket atau key kosong. bucket={bucket!r} key={key!r}")
            return None

        print(f"[PRESIGNED] Bucket: {bucket!r}")
        print(f"[PRESIGNED] Key: {key!r}")
        print(f"[PRESIGNED] AWS Region: {AWS_REGION!r}")

        # -------------------------------------------------
        # Buat presigned URL
        # -------------------------------------------------

        url = s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": bucket,
                "Key": key,

                # Supaya browser membaca file sebagai PDF
                "ResponseContentType": "application/pdf",

                # Supaya PDF dibuka di browser,
                # bukan dipaksa download
                "ResponseContentDisposition": "inline",
            },
            ExpiresIn=3600,
        )

        print(f"[PRESIGNED] URL berhasil dibuat: {url[:80]}...")

        return url

    except Exception as error:

        import traceback

        print(f"[PRESIGNED] GAGAL membuat presigned URL untuk {uri!r}")
        print(f"[PRESIGNED] Error: {error}")
        print(f"[PRESIGNED] Traceback:\n{traceback.format_exc()}")

        return None


# =========================================================
# KNOWLEDGE BASE ASSISTANT
# =========================================================

def ask_knowledge_base(question: str):

    # =====================================================
    # 1. RETRIEVE RELEVANT INFORMATION
    # =====================================================

    retrieve_response = kb_client.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,

        retrievalQuery={
            "text": question
        },

        retrievalConfiguration={
            "managedSearchConfiguration": {
                "numberOfResults": 5
            }
        },
    )

    results = retrieve_response.get(
        "retrievalResults",
        []
    )


    # =====================================================
    # TIDAK ADA DOKUMEN YANG RELEVAN
    # =====================================================

    if not results:

        return {
            "answer": (
                "I couldn't find relevant information in "
                "the travel knowledge base."
            ),
            "sources": [],
        }


    # =====================================================
    # 2. AMBIL TEXT DAN SOURCE
    # =====================================================

    context_parts = []
    sources = []


    for result in results:

        # -------------------------------------------------
        # Ambil text hasil retrieval
        # -------------------------------------------------

        content = result.get(
            "content",
            {}
        )

        text = content.get("text")

        if text:
            context_parts.append(text)


        # -------------------------------------------------
        # Ambil lokasi source
        # -------------------------------------------------

        location = result.get(
            "location",
            {}
        )

        print(f"[KB] Raw location object: {location}")

        s3_location = location.get(
            "s3Location",
            {}
        )

        uri = s3_location.get("uri")

        print(f"[KB] S3 URI ditemukan: {uri!r}")


        # =================================================
        # JIKA ADA S3 URI
        # =================================================

        if uri:

            # -------------------------------------------------
            # Ambil nama file
            # -------------------------------------------------

            source_name = uri.split("/")[-1]

            # -------------------------------------------------
            # Buat temporary URL (presigned)
            # Fallback ke URI asli jika presigned gagal
            # karena IAM tidak punya s3:GetObject
            # -------------------------------------------------

            source_url = create_presigned_url(uri)

            # Fallback: kalau presigned gagal karena
            # AccessDenied atau IAM issue, gunakan
            # HTTPS URI langsung dari Knowledge Base.
            # URL ini mungkin tetap kena AccessDenied
            # jika bucket private, tapi minimal link
            # bisa diklik dan error terlihat jelas.
            if source_url is None and uri.startswith("https://"):
                print(
                    "[KB] Presigned URL gagal, fallback ke URI langsung"
                )
                source_url = uri


            # -------------------------------------------------
            # DEBUG LOG
            # -------------------------------------------------

            print(
                "================================================="
            )

            print(
                "SOURCE URI:",
                uri
            )

            print(
                "SOURCE NAME:",
                source_name
            )

            print(
                "SOURCE URL:",
                source_url
            )

            print(
                "================================================="
            )


            # -------------------------------------------------
            # Tambahkan source jika belum ada
            # -------------------------------------------------

            if source_name:

                already_exists = any(
                    source["name"] == source_name
                    for source in sources
                )

                if not already_exists:

                    sources.append(
                        {
                            "name": source_name,
                            "url": source_url,
                        }
                    )


        # =================================================
        # FALLBACK METADATA
        # =================================================

        if not uri:

            metadata = result.get(
                "metadata",
                {}
            )

            source_name = (
                metadata.get("source")
                or metadata.get("fileName")
                or metadata.get("filename")
            )


            if source_name:

                already_exists = any(
                    source["name"] == source_name
                    for source in sources
                )

                if not already_exists:

                    sources.append(
                        {
                            "name": source_name,
                            "url": None,
                        }
                    )


    # =====================================================
    # TIDAK ADA TEXT YANG BISA DIBACA
    # =====================================================

    if not context_parts:

        return {
            "answer": (
                "I couldn't find readable information in "
                "the travel knowledge base."
            ),
            "sources": sources,
        }


    # =====================================================
    # 3. GABUNGKAN CONTEXT
    # =====================================================

    context = "\n\n---\n\n".join(
        context_parts
    )


    # =====================================================
    # 4. PROMPT AMAZON NOVA
    # =====================================================

    prompt = f"""
You are KelanaAI, a travel assistant.

Answer the user's question using ONLY the information provided
in the retrieved travel documents below.

If the answer cannot be found in the documents, say that the
information is not available in the travel knowledge base.

Do not invent facts.

Retrieved travel documents:

{context}

User question:

{question}

Provide a clear and concise answer.
"""


    # =====================================================
    # 5. KIRIM KE AMAZON NOVA
    # =====================================================

    response = bedrock_client.converse(
        modelId=KNOWLEDGE_BASE_MODEL_ARN,

        messages=[
            {
                "role": "user",

                "content": [
                    {
                        "text": prompt
                    }
                ],
            }
        ],

        inferenceConfig={
            "maxTokens": 512,
            "temperature": 0.2,
            "topP": 0.9,
        },
    )


    # =====================================================
    # 6. AMBIL JAWABAN
    # =====================================================

    answer = (
        response["output"]
        ["message"]
        ["content"][0]
        ["text"]
    )


    # =====================================================
    # 7. RETURN ANSWER + SOURCES
    # =====================================================

    print(f"[KB] Total sources yang akan dikembalikan: {len(sources)}")
    for i, src in enumerate(sources):
        print(f"[KB] Source[{i}] name={src['name']!r} url={'<ada>' if src.get('url') else '<None>'}")

    return {
        "answer": answer,
        "sources": sources,
    }