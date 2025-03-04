# GitHub Profile Collage Generator

A modern web app that creates a collage of GitHub profile pictures based on a list of usernames.

![Demo of GitHub Profile Collage Generator](img/demo.png)

## Features

- Enter multiple GitHub usernames
- Automatically fetches profile pictures
- Generates a customized collage based on the number of profiles
- Download the collage as a PNG image with transparent background
- Fully client-side (no server required)
- Modern UI built with Tailwind CSS

## How to Use

1. Visit the [GitHub Profile Collage Generator](https://yourusername.github.io/collage_js/)
2. Enter GitHub usernames, one per line
3. Click "Generate Collage"
4. Once the collage is created, click "Download Collage" to save it as a PNG

## Technical Details

- Pure HTML/JavaScript solution with Tailwind CSS for styling
- Uses GitHub's profile picture API (.png URL extension)
- Responsive design that works on mobile and desktop
- Canvas API for image manipulation and collage creation
- Tailwind CSS via CDN for modern, utility-first styling

## Demo Examples

The tool creates clean circular avatars on a transparent background that can be used in documentation, presentations, or team pages:

```
# Example usage:
octocat
defunkt
mojombo
wycats
ezmobius
```

## CORS Issues and Solutions

This application uses two methods to avoid CORS restrictions:

1. **GitHub API Method (Default)**: Uses the GitHub API to fetch user data including avatar URLs which are CORS-friendly.
2. **CORS Proxy Method (Fallback)**: Uses public CORS proxies to fetch images when the API method fails.

In local development, CORS issues are common. Here are ways to handle them:

- Use the deployed version on GitHub Pages (recommended for end users)
- Install a CORS browser extension like "CORS Unblock" for testing
- Run Chrome with web security disabled (NOT recommended for regular browsing):

  ```
  # Windows
  chrome.exe --disable-web-security --user-data-dir="%TEMP%\chrome_dev_session"
  
  # macOS
  open -a "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome_dev"
  
  # Linux
  google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
  ```

Note: Some public CORS proxies have rate limits. For production use, consider deploying your own proxy.

## Local Development

### Method 1: Direct File Opening

Simply open `index.html` in your browser. However, browsers will likely block image loading due to CORS policies.

### Method 2: Using a Local Web Server

For the best experience, run the project with a simple web server:

#### Using Python

If you have Python installed:

```bash
# Python 3
cd /path/to/collage_js
python -m http.server 8000

# Python 2
cd /path/to/collage_js
python -m SimpleHTTPServer 8000
```

Then visit <http://localhost:8000> in your browser.

#### Using Node.js

There are several ways to run a server with Node.js without requiring global installations:

##### Using npx with http-server

If you have npm installed (comes with Node.js), you can use npx to run http-server without a global installation:

```bash
cd /path/to/collage_js
npx http-server -p 8000
```

#### Using VS Code

If you use Visual Studio Code, you can use the "Live Server" extension:

1. Install the "Live Server" extension
2. Right-click on `index.html` and select "Open with Live Server"

## License

MIT
