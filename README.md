# Joshua Philip Cagaanan — IT Portfolio

A responsive personal portfolio built with semantic HTML, CSS, and vanilla JavaScript. It is designed to work as a static site on GitHub Pages.

## Preview locally

Open `index.html` in a browser, or use the **Live Server** extension in Visual Studio Code and choose **Open with Live Server**. No build step or package installation is required.

## Add a profile photo

Place a portrait at `profile.png.png` beside `index.html`. The frame preserves the image proportions and crops it to fit; if the file is absent, the page displays the JPC initials artwork instead.

The AI certificate preview currently loads from `../AI CERT.png`. Before publishing only the `Joshua-Portfolio` folder, place `AI CERT.png` beside `index.html` and update the certificate image path in `index.html` to `AI%20CERT.png`.

## Publish with GitHub Pages

1. Create a GitHub repository and add the contents of the `Joshua-Portfolio` folder to its root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save.
4. Wait for the Pages deployment to finish and open the URL shown in the Pages settings.

The page uses relative asset and stylesheet paths, so it can also be hosted from a project subpath.

## Personalize

Update the static profile details and links in `index.html`. The copyright year is generated automatically. Keep education, certifications, and project claims limited to information that can be verified.
