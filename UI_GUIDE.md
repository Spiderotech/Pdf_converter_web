# PDF Converter Web - UI Guide

## 1. Design Goal

The updated website should feel like a professional document utility, not a toy app or childish converter page.

The design should communicate:

- Trust
- Speed
- Simplicity
- File safety
- Professional document handling
- Clear tool workflows

Good reference style:

```text
Clean SaaS utility + modern document tools + practical dashboard clarity
```

Avoid:

```text
Cartoon design
Childish illustrations
Too many bright colors
Oversized decorative graphics
Random gradients
Busy backgrounds
Floating blob/orb decorations
Fake playful mascots
```

## 2. Product Personality

The website should feel:

- Professional
- Calm
- Fast
- Organized
- Secure
- Useful
- Modern

The website should not feel:

- Childish
- Over-decorated
- Loud
- Confusing
- Like a school project
- Like a generic template

## 3. Visual Direction

Use a clean, restrained interface with strong spacing, clear hierarchy, and simple tool-focused pages.

Recommended visual style:

- White or very light gray background
- Dark readable text
- One strong primary color
- Small accent colors for file types and statuses
- Subtle borders
- Light shadows only when needed
- Professional icons
- Clear upload/drop areas
- Simple cards for tools

Use visual assets only where they help the user understand the product. Do not use large decorative illustrations unless they add value.

## 4. Color System

Recommended base palette:

```text
Background:       #F8FAFC
Surface:          #FFFFFF
Primary text:     #111827
Secondary text:   #4B5563
Muted text:       #6B7280
Border:           #E5E7EB
Soft border:      #EEF2F7
Primary blue:     #2563EB
Primary hover:    #1D4ED8
Success:          #16A34A
Warning:          #F59E0B
Error:            #DC2626
```

Optional file-type accents:

```text
PDF red:          #DC2626
Word blue:        #2563EB
Excel green:      #16A34A
PowerPoint orange:#EA580C
Neutral tools:    #475569
```

Rules:

- Do not make the entire site red just because PDF is red.
- Do not use too many gradients.
- Do not use purple-heavy or neon palettes.
- Use color to guide actions and identify file types.
- Keep most surfaces white or light gray.

## 5. Typography

Use a clean sans-serif font.

Recommended:

```text
Inter
```

Fallback:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Type scale:

```text
Page title:        36-48px desktop, 30-36px mobile
Section title:     24-32px
Card title:        16-20px
Body text:         15-16px
Small text:        13-14px
Button text:       14-15px
```

Rules:

- Do not use decorative fonts.
- Do not use huge headings inside small cards.
- Do not use negative letter spacing.
- Keep line-height comfortable.
- Use bold text only for hierarchy, not decoration.

## 6. Layout Principles

Use a simple page structure:

```text
Header
Main tool area
Supporting content
Related tools
FAQ / help content
Footer
```

Recommended max widths:

```text
Main content:      1120px
Text content:      760px
Tool workspace:    920px
```

Spacing:

```text
Small gap:         8px
Default gap:       16px
Section gap:       48-72px
Page padding:      16px mobile, 24-32px desktop
```

Rules:

- Keep pages scannable.
- Avoid nested cards.
- Avoid huge empty hero sections.
- Do not place important controls below excessive marketing copy.
- The tool should be visible early on the page.

## 7. Header and Navigation

The header should be simple and functional.

Recommended desktop header:

```text
Logo / brand name
Tools
Compress
Merge
Split
Convert
Contact
```

Recommended mobile header:

```text
Logo
Menu button
```

Rules:

- No login/register buttons for launch unless accounts are enabled.
- Keep navigation labels short.
- Use dropdowns only if the tools list becomes too long.
- Header should not be visually heavy.
- Use sticky header only if it does not reduce workspace too much.

## 8. Homepage Design

The homepage should immediately show what the site does.

Recommended first viewport:

```text
Headline: Free PDF and document tools
Short supporting text
Primary action: Choose a tool
Tool grid visible immediately or partly visible
```

Avoid:

- Generic marketing hero with no tools visible.
- Large abstract illustration taking half the page.
- Childish icons or cartoon assets.
- Overpromising copy like "world's best" unless proven.

Homepage sections:

```text
Hero / tool search
Popular tools grid
How it works
Privacy/safety note
All tools
FAQ
Footer
```

## 9. Tool Grid

Tool cards should be practical and easy to scan.

Each card should include:

- File-type icon or simple tool icon
- Tool name
- One-line description
- Supported file type label

Example card content:

```text
Merge PDF
Combine multiple PDF files into one document.
PDF
```

Card styling:

```text
Background: white
Border: 1px solid light gray
Radius: 8px
Padding: 16-20px
Hover: subtle border/color change
```

Rules:

- Do not make cards oversized.
- Do not use heavy shadows.
- Do not place cards inside another large card.
- Use consistent icon sizes.
- Keep descriptions short.

## 10. Tool Page Layout

Each tool page should follow a consistent structure.

Recommended:

```text
Tool title
Short description
Upload/drop zone
Processing state
Result/download state
Privacy note
Related tools
How to use
FAQ
```

Example:

```text
Merge PDF
Combine multiple PDF files into one document.

[Upload / Drop Zone]

Files are processed temporarily and deleted after conversion.
```

Rules:

- The upload box should be the main focus.
- Do not hide the upload box below long text.
- Keep the conversion workflow obvious.
- Show supported formats near the upload area.
- Show file size limit clearly.

## 11. Upload Area

The upload area is the most important UI element on tool pages.

Recommended design:

```text
Large dashed border area
Clear upload icon
Primary button: Choose files
Secondary text: or drop files here
Supported formats
Max file size
```

Example text:

```text
Choose PDF files
or drop files here
Supports PDF up to 25 MB
```

States:

```text
Default
Hover
Dragging
File selected
Uploading
Processing
Success
Error
```

Rules:

- Do not auto-start upload if the tool requires options first.
- For simple tools, auto-start is acceptable after file selection.
- Show selected file names.
- Allow removing a file before processing.
- For merge tools, allow reordering files.

## 12. Buttons

Use clear, consistent buttons.

Primary actions:

```text
Choose files
Convert
Merge PDF
Download
```

Secondary actions:

```text
Add more files
Remove
Start over
Preview
```

Button style:

```text
Border radius: 6-8px
Height: 40-44px
Font weight: 500-600
```

Rules:

- Primary button should use the main brand color.
- Download button can use success green.
- Destructive actions should use red only when needed.
- Do not use many competing button colors on one screen.
- Use icons for common actions where helpful.

## 13. Icons

Use a professional icon library.

Recommended:

```text
lucide-react
```

Useful icons:

```text
Upload
Download
FileText
Files
Scissors
PenLine
Lock
Unlock
Shield
FileArchive
FileSpreadsheet
Presentation
RefreshCw
Trash2
Plus
GripVertical
CheckCircle
AlertCircle
```

Rules:

- Keep icon size consistent.
- Do not mix many icon styles.
- Avoid cartoon icons.
- Use file-type colors carefully.

Install:

```bash
cd Client
npm install lucide-react
```

## 14. Processing and Loading States

Processing should feel calm and reliable.

Use:

- Progress indicator if available
- Spinner if progress is unknown
- Short status text
- Disabled action buttons during processing

Example status text:

```text
Uploading file...
Processing document...
Preparing download...
```

Avoid:

- Funny loading messages
- Excessive animation
- Large GIFs
- Loud flashing effects

## 15. Result and Download State

After processing, show a clear result area.

Recommended:

```text
Success icon
Short success message
Download button
Start over button
Related tool suggestion
```

Example:

```text
Your file is ready.
[Download PDF]
[Start over]
```

Rules:

- Do not make ads look like download buttons.
- Keep download action visually obvious.
- Use the correct output file extension.
- Allow the user to process another file easily.

## 16. Error States

Errors should be useful and calm.

Examples:

```text
This file type is not supported. Please upload a PDF file.
The file is larger than the 25 MB limit.
We could not process this file. Please try another file.
This PDF appears to be password protected.
```

Rules:

- Do not show raw server errors.
- Explain what the user can do next.
- Keep error text short.
- Use red only for the error message, not the whole page.

## 17. PDF Edit UI

The Edit PDF tool should be simple in the first version.

MVP editing tools:

- Add text
- Add image
- Draw/sign
- Highlight
- Rotate page
- Delete page

Recommended layout:

```text
Top toolbar
Left page thumbnails
Center PDF canvas
Right options panel if needed
Bottom action bar on mobile
```

Rules:

- Keep the editor practical.
- Do not overload the first version with complex features.
- Use icons with tooltips.
- Make Save/Download very clear.
- Keep toolbar compact.

## 18. Sign PDF UI

The Sign PDF tool should support simple visual signatures first.

Signature input options:

- Draw signature
- Type signature
- Upload signature image

Flow:

```text
Upload PDF -> create signature -> place signature -> download signed PDF
```

Rules:

- Clearly state that this is a visual signature, not a certificate-based digital signature.
- Let users resize and move the signature.
- Keep the signature placement screen clean.

## 19. Merge PDF UI

Merge PDF needs file ordering.

Required UI:

- Multi-file upload
- File list
- Drag to reorder
- Remove file button
- Add more files button
- Merge button

File list item:

```text
Drag handle
File name
Page count if available
Remove icon
```

Rules:

- Reordering must be easy.
- Show the final merge order clearly.
- Do not start merging before the user confirms order.

## 20. Split PDF UI

Split PDF needs a simple page selection method.

Options:

- Extract every page
- Select page range
- Select specific pages

Examples:

```text
1-3
1,4,7
1-3,8,10-12
```

Rules:

- Validate page ranges before processing.
- Show total page count if available.
- Keep range examples visible.

## 21. Compress PDF UI

Compression should have simple choices.

Recommended options:

```text
Low compression - better quality
Medium compression - recommended
High compression - smaller file
```

Rules:

- Do not promise exact file size reduction.
- Show original and compressed file size if available.
- Use "recommended" for the default option.

## 22. Protect and Unlock PDF UI

Protect PDF:

```text
Upload PDF
Enter password
Confirm password
Protect PDF
Download protected PDF
```

Unlock PDF:

```text
Upload locked PDF
Enter password
Unlock PDF
Download unlocked PDF
```

Rules:

- Use password visibility toggle.
- Do not store passwords.
- Show clear failure message if password is wrong.
- Add privacy note near the form.

## 23. Ad Placement UI

Ads should not damage trust.

Recommended placements:

- Below tool upload area
- Below result/download area
- Between help content sections
- Sidebar on desktop only if layout allows

Avoid:

- Ads above the upload area on tool pages
- Ads that look like action buttons
- Ads too close to download buttons
- Too many ads on one page
- Layout shifts when ads load

Reserve stable ad space:

```text
Desktop banner: 728x90 or responsive slot
Mobile banner: 320x100 or responsive slot
```

## 24. Trust and Privacy UI

Add a small privacy note near upload areas.

Example:

```text
Files are processed temporarily and deleted after processing.
```

Optional trust row:

```text
No signup required
Temporary file processing
Secure HTTPS connection
```

Rules:

- Keep trust text factual.
- Do not overpromise.
- Link to privacy policy.

## 25. Footer

Footer should be useful and compact.

Recommended links:

```text
Tools
Privacy Policy
Terms
Contact
About
```

Optional:

```text
Compress PDF
Merge PDF
Split PDF
PDF to Word
Word to PDF
XLSX to CSV
```

Rules:

- Do not make footer visually heavy.
- Keep link groups organized.
- Include copyright.

## 26. Mobile Design

Mobile is very important.

Rules:

- Upload area must fit well on small screens.
- Buttons should be at least 40px tall.
- Tool cards should use one column.
- PDF editor should use a simplified mobile toolbar.
- Avoid fixed-width iframes or previews.
- Text must not overflow buttons or cards.
- Use responsive containers, not viewport-scaled fonts.

Recommended mobile page order:

```text
Header
Tool title
Upload area
Selected files/options
Action button
Result
Related tools
How to use
FAQ
Footer
```

## 27. Accessibility

Minimum requirements:

- Good color contrast
- Keyboard accessible controls
- Visible focus states
- Proper labels for file inputs
- Button text must describe action
- Icons need labels or tooltips where meaning is not obvious
- Error messages should be readable by screen readers

Rules:

- Do not rely on color alone.
- Do not hide important actions behind hover-only UI.
- Use semantic buttons and links correctly.

## 28. Design System Components

Create reusable UI components:

```text
Button
IconButton
Input
PasswordInput
Select
RadioGroup
Tabs
FileDropzone
FileList
ToolCard
ToolLayout
AdBanner
Alert
ProgressBar
Modal
Tooltip
```

Recommended folder:

```text
Client/src/Components/ui/
Client/src/Components/tools/
Client/src/Components/ads/
```

## 29. Page Copy Style

Use clear, direct copy.

Good:

```text
Merge PDF files
Combine multiple PDFs into one document.
Choose PDF files
Download merged PDF
```

Avoid:

```text
Unleash your magical PDF powers
Super awesome PDF merger
Transform your workflow with revolutionary document experiences
```

Rules:

- Be useful.
- Be specific.
- Keep sentences short.
- Avoid hype.
- Avoid childish wording.

## 30. Final UI Checklist

Before launch, check:

- Header is simple and professional.
- Tool pages show upload area immediately.
- No childish illustrations or loud graphics.
- Colors are restrained and consistent.
- Buttons are clear.
- Mobile layout works.
- Text does not overflow.
- Ads do not look like download buttons.
- Error states are helpful.
- Files/privacy note is visible.
- Tool cards are easy to scan.
- Footer includes privacy, terms, and contact links.

The final website should look like a serious, modern file utility that users can trust with documents.
