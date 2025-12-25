import PyPDF2

pdf_path = r"d:\Projects\zotimi\doc\Zotimet-Siguri-dhe-Begati-VETEVENDOSJE-2025.pdf"
output_path = r"d:\Projects\zotimi\doc\extracted\Zotimet-Siguri-dhe-Begati-VETEVENDOSJE-2025_v2.txt"

try:
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n\n"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
    print("Extraction successful.")
except Exception as e:
    print(f"Error: {e}")
