# Carrot Feedback to Markdown

- https://www.carrotenglish.com/main

This Chrome extension converts Carrot English feedback emails into Markdown files. It parses the email’s HTML to extract the lesson date, instructor’s name, teacher comments and all original vs. corrected sentences, then assembles a clean Markdown summary ready for download.

### Features

-	One‑click export: When reading a feedback email, simply click the extension’s toolbar icon. The extension automatically parses the page and downloads a YYYY‑MM‑DD_feedback.md file containing your corrections.
-	Structured output: The Markdown file begins with the date and instructor, followed by the teacher’s comment and a table listing each “Original” sentence alongside its improved version.
-	Clean extraction: Only the relevant lesson content is included; ancillary footers, advertisements or contact links are removed.
-	Customizable icon: The extension includes a default icon set for 16, 32, 48 and 128‑pixel sizes. You can replace these images with your own by updating the files in the icons/ directory and adjusting the manifest.json accordingly.

### Installation

1.	Download and unpack the extension: Unzip the provided archive to a convenient location on your computer (for example, your Downloads folder). Ensure the unzipped folder contains manifest.json, background.js, contentScript.js, icons/, and this README.md.
2.	Enable developer mode: In Chrome or Chromium, open chrome://extensions and toggle on Developer mode in the upper right corner.
3.	Load the extension: Click Load unpacked, navigate to the unzipped extension folder, and select it. The extension should appear in your list with the provided icon.

### Usage

1.	Open a Carrot English feedback email in your browser.
2.	Click the extension icon in the toolbar. The extension will analyze the page and automatically trigger a Markdown download. The filename will include the lesson date (e.g., 2026-03-20_feedback.md).
3.	Open the downloaded file in your favorite Markdown editor to review or store your lesson corrections.

#### Customizing the Icon

To change the toolbar icon:
1.	Prepare replacement images for the sizes 16×16, 32×32, 48×48 and 128×128 pixels, preferably in PNG format.
2.	Place your images in the icons/ directory of the extension, replacing the existing icon16.png, icon32.png, icon48.png and icon128.png files.
3.	Update the manifest.json if your file names differ, ensuring that the action.default_icon and top‑level icons properties point to your new files. Chrome’s documentation recommends providing multiple sizes to future‑proof your extension  .
4.	Save your changes and reload the extension via chrome://extensions by clicking the reload button next to the extension entry.

### Limitations

-	This extension is designed specifically for the HTML structure of Carrot English feedback emails. If the email template changes significantly, the extraction may fail.
-	The extension does not currently support automatic updates; to upgrade to a new version, remove the existing extension and install the updated unpacked version.

### License

- This project is provided for personal use. You are free to modify and extend it to suit your needs.
