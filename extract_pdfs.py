import pdfplumber
import os

pdf_dir = r"d:\Projects\zotimi\doc"
output_dir = r"d:\Projects\zotimi\doc\extracted"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

pdfs = [
    "KosovaFituese_compressed-WEB (1).pdf",
    "Rruga-e-Re-_Programi_Web.pdf",
    "Zotimet-Siguri-dhe-Begati-VETEVENDOSJE-2025.pdf",
    "pdk-programi-elektoral_5c524283.pdf"
]

for pdf_name in pdfs:
    pdf_path = os.path.join(pdf_dir, pdf_name)
    output_path = os.path.join(output_dir, pdf_name.replace(".pdf", ".txt"))
    
    print(f"Processing {pdf_name}...")
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n\n"
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {pdf_name}: {e}")
