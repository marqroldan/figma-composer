![Cover](cover.png)
# Composer
Mail-merge type of plugin. Generate personalized PDFs with Google Sheets

### Note / How-to Use
- Make sure to generate your own Google Sheets-scoped API key so you can access your Google Sheet file
- Make sure your Google Sheet file is visible to anyone with the link (not limited to people added)
- Headers will always be on the first row
  - They can only be alphanumeric, with dashes, and underscores
- Make sure a frame layer is selected
- Make sure to insert `%%{header name}%%`on your text, the plugin will loop over the text layers under the selected frame
- Only Text layer is supported at the moment

### If you're having problems or want something to be better feel free to open an issue!

### -
Thank you very much to the owner of this package, https://github.com/brianlovin/figma-export-zip, because without it I wouldn't have had any clue that you can generate archives using only just Javascript
