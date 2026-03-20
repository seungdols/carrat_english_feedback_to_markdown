/*
 * This content script extracts information from a Carrot English feedback email
 * and generates a Markdown file summarizing the lesson corrections. It looks
 * specifically for the date of the lesson, the instructor’s name, the
 * teacher’s comment, and pairs of original/better sentences. The script
 * relies on the structure of the HTML provided by Carrot English emails.
 *
 * The core workflow:
 *   1. Locate the main container (.txt_mailview) that holds the email body.
 *   2. Extract the lesson date from a heading element styled with
 *      font-size 22px, taking only the first line before the line break.
 *   3. Find the instructor’s name by searching for the text “담당강사” and
 *      capturing the string that follows a colon.
 *   4. Pull out the teacher’s comment from the first DIV styled with
 *      margin-bottom: 15px after the “Teacher's Comment” heading, removing
 *      any nested tables used for corrections so only the commentary text
 *      remains.
 *   5. Iterate over each corrections table (identified by a margin-top: 30px
 *      style) and extract the original and improved sentences from the
 *      second cell of each row.
 *   6. Compose a Markdown formatted string and trigger a download of a
 *      .md file using a temporary anchor element.
 */

// Listen for a runtime message from the background script to start processing.
// In Manifest V3 extensions, content scripts cannot directly listen for
// chrome.action.onClicked events; instead, the background injects this script
// when the user clicks the extension icon.
(function() {
  try {
    // Select the email content container. If it doesn’t exist, fall back to the
    // entire document body so that the script doesn’t throw.
    const container = document.querySelector('.txt_mailview') || document.body;

    // Helper to sanitize text by trimming whitespace and collapsing multiple
    // spaces/newlines into a single space.
    function cleanText(str) {
      return str.replace(/\s+/g, ' ').trim();
    }

    // Extract the date. The date appears in a div with a font-size: 22px style
    // followed by a line break and the title of the feedback. We capture the
    // first line of the innerText. If not found, attempt a regex search.
    let dateText = '';
    const dateDiv = container.querySelector('div[style*="font-size: 22px"]');
    if (dateDiv) {
      // innerText preserves line breaks; take the first line for the date.
      const lines = dateDiv.innerText.split(/\n|<br>/).map(l => l.trim()).filter(l => l);
      if (lines.length > 0) {
        dateText = lines[0];
      }
    }
    if (!dateText) {
      // Fallback: look for a date pattern YYYY-MM-DD anywhere in the container.
      const match = container.innerText.match(/\d{4}-\d{2}-\d{2}/);
      if (match) {
        dateText = match[0];
      }
    }

    // Extract the instructor’s name by finding the phrase “담당강사” and
    // capturing the text after a colon. Use a regex to be robust.
    let teacherName = '';
    const teacherMatch = container.innerText.match(/담당강사\s*[:：]\s*([^\n]+)/);
    if (teacherMatch) {
      teacherName = teacherMatch[1].trim();
    }

    // Extract the teacher’s comment. Locate the section by finding the first
    // <div> with a margin-bottom: 15px style (based on the provided markup).
    let teacherComment = '';
    const commentDiv = container.querySelector('div[style*="margin-bottom: 15px"]');
    if (commentDiv) {
      // Clone the element so we can remove nested tables without affecting the
      // original DOM.
      const clone = commentDiv.cloneNode(true);
      clone.querySelectorAll('table').forEach(tbl => tbl.remove());
      teacherComment = cleanText(clone.innerText);
    }

    // Extract correction pairs. Each corrections table has margin-top: 30px.
    const corrections = [];
    const correctionTables = container.querySelectorAll('table[style*="margin-top: 30px"]');
    correctionTables.forEach(table => {
      const rows = table.rows;
      if (rows && rows.length >= 2) {
        const originalCell = rows[0].cells[1];
        const betterCell = rows[1].cells[1];
        if (originalCell && betterCell) {
          corrections.push({
            original: cleanText(originalCell.innerText),
            better: cleanText(betterCell.innerText)
          });
        }
      }
    });

    // Assemble Markdown content. Use headings to separate sections.
    let md = '';
    if (dateText || teacherName) {
      md += `# ${dateText}${teacherName ? ' - ' + teacherName : ''}\n\n`;
    }
    if (teacherComment) {
      md += '**Teacher\'s Comment**\n\n';
      md += teacherComment + '\n\n';
    }
    if (corrections.length > 0) {
      md += '| Original | Better |\n';
      md += '| --- | --- |\n';
      corrections.forEach(pair => {
        md += `| ${pair.original} | ${pair.better} |\n`;
      });
    }

    // Determine filename. Use the date if available; otherwise, default to
    // feedback.md.
    const filename = (dateText ? dateText + '_feedback.md' : 'feedback.md');

    // Trigger download of the Markdown content as a file. Create a Blob,
    // generate an object URL and simulate a click on a temporary anchor.
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error('Error generating feedback markdown:', err);
  }
})();