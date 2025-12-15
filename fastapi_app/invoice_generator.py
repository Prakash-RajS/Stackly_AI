# fastapi_app/invoice_generator.py

import io
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from pathlib import Path
from fastapi_app.storage import save_bytes_file, get_file_url, get_generated_invoices_path
import uuid


def generate_invoice_pdf(data: dict) -> str:
    """
    Generate invoice PDF and save directly to S3 (or local fallback)
    Returns: Public URL of the generated PDF
    """
    try:
        # 1. Load HTML template
        current_dir = Path(__file__).resolve().parent
        template_dir = current_dir / "frontend"  # your invoice_template.html is here
        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template("invoice_template.html")

        # 2. Render HTML with data
        html_content = template.render(data)

        # 3. Convert HTML → PDF in memory
        pdf_buffer = io.BytesIO()
        pisa_status = pisa.CreatePDF(
            src=html_content,
            dest=pdf_buffer,
            encoding='UTF-8'
        )

        if pisa_status.err:
            raise RuntimeError(f"PDF generation failed: {pisa_status.err}")

        pdf_bytes = pdf_buffer.getvalue()
        pdf_buffer.close()

        # 4. Generate unique filename
        invoice_id = data.get("invoice_id", "invoice")
        filename = f"{invoice_id}_{uuid.uuid4().hex[:8]}.pdf"
        s3_key = get_generated_invoices_path(filename)  # → "generated_invoices/xxx.pdf"

        # 5. Save directly to S3 (or local)
        import asyncio
        asyncio.run(save_bytes_file(pdf_bytes, s3_key))

        # 6. Return public URL
        return get_file_url(s3_key)

    except Exception as e:
        print(f"Error generating invoice PDF: {str(e)}")
        raise RuntimeError(f"Failed to generate invoice: {str(e)}")
