document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const files = document.getElementById("pdfFiles").files;
    if (files.length === 0) {
        alert("Please upload at least one PDF file.");
        return;
    }

    const formData = new FormData();
    for (const file of files) {
        formData.append("files", file);
    }

    const loader = document.getElementById("loader");
    const resultContainer = document.getElementById("resultContainer");
    const summaryText = document.getElementById("summaryText");

    loader.classList.remove("hidden");
    resultContainer.classList.add("hidden");

    try {
        const response = await fetch("/summarize", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error while processing the PDFs.");
        }

        const data = await response.json();
        summaryText.value = data.summary || "No summary generated.";
        loader.classList.add("hidden");
        resultContainer.classList.remove("hidden");
    } catch (error) {
        loader.classList.add("hidden");
        alert("An error occurred: " + error.message);
    }
});

document.getElementById("downloadButton").addEventListener("click", () => {
    const text = document.getElementById("summaryText").value;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.txt";
    link.click();
});
