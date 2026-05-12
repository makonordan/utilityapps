import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import ConvertAPI from "convertapi";

export const runtime = "nodejs";

// 10 MB cap — same as the upstream PDF_Converter project.
const MAX_SIZE = 10 * 1024 * 1024;

/**
 * PDF → DOCX conversion endpoint.
 *
 * The static-exported PDF Converter UI lives at /embeds/pdf-converter/ but
 * its FileUploader component calls `/api/convert` with a bare absolute path
 * (next.js basePath does NOT rewrite bare fetch calls). So when the UI is
 * iframed inside utilityapps, this is the route it hits.
 *
 * Requires a CONVERTAPI_SECRET env var (paid third-party service).
 * Without it the conversion returns a friendly error.
 */
export async function POST(request: NextRequest) {
  if (!process.env.CONVERTAPI_SECRET) {
    return NextResponse.json(
      {
        error:
          "Conversion service is not configured on this server. Set CONVERTAPI_SECRET in your environment.",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // After the typeof check above, `file` is a File-like Blob.
  const blob = file as File;

  if (blob.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are accepted." },
      { status: 415 }
    );
  }

  if (blob.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be under 10 MB." },
      { status: 413 }
    );
  }

  try {
    const convertapi = new ConvertAPI(process.env.CONVERTAPI_SECRET, {
      conversionTimeout: 60,
    });

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    const uploaded = await convertapi.upload(stream, blob.name);
    const result = await convertapi.convert("docx", { File: uploaded }, "pdf");

    const docxUrl = result.file.url;
    const docxResponse = await fetch(docxUrl);
    if (!docxResponse.ok) {
      throw new Error(`Failed to fetch converted file: ${docxResponse.status}`);
    }

    const docxBuffer = await docxResponse.arrayBuffer();
    const outputName = blob.name.replace(/\.pdf$/i, ".docx");

    return new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${outputName}"`,
        "Content-Length": String(docxBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error("[api/convert]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Conversion failed. Please try again." },
      { status: 500 }
    );
  }
}
