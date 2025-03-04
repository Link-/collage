document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('usernames');
    const generateBtn = document.getElementById('generate');
    const downloadBtn = document.getElementById('download');
    const statusEl = document.getElementById('status');
    const canvas = document.getElementById('collage');
    const ctx = canvas.getContext('2d');

    generateBtn.addEventListener('click', generateCollage);
    downloadBtn.addEventListener('click', downloadCollage);

    // Method 1: Using a CORS proxy
    const corsProxies = [
        'https://corsproxy.io/?',
    ];
    let currentProxyIndex = 0;

    async function generateCollage() {
        const usernames = textarea.value.trim().split('\n').filter(username => username.trim() !== '');

        if (usernames.length === 0) {
            showStatus('Please enter at least one username', 'error');
            return;
        }

        showStatus('Fetching GitHub profiles...', 'success');
        generateBtn.disabled = true;
        downloadBtn.disabled = true;

        // Show loading state
        generateBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        `;

        try {
            const images = await fetchGitHubAvatars(usernames);
            if (images.length > 0) {
                createCollage(images);
                showStatus(`Created collage with ${images.length} images`, 'success');
                downloadBtn.disabled = false;
            } else {
                showStatus('Could not fetch any valid GitHub profile images', 'error');
            }
        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
        } finally {
            generateBtn.disabled = false;
            // Reset button
            generateBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd" />
                </svg>
                Generate Collage
            `;
        }
    }

    async function fetchGitHubAvatars(usernames) {
        const images = [];
        const failedImages = [];

        // Method 2: Use the GitHub API instead (doesn't require CORS proxy)
        const useGithubAPI = true;

        for (let username of usernames) {
            try {
                username = username.trim();
                if (!username) continue;

                let imageUrl;

                if (useGithubAPI) {
                    // GitHub API method - avoids CORS by using the API to get avatar URL
                    try {
                        const response = await fetch(`https://api.github.com/users/${username}`);
                        if (response.ok) {
                            const userData = await response.json();
                            imageUrl = userData.avatar_url;
                        } else {
                            throw new Error(`GitHub API returned ${response.status}`);
                        }
                    } catch (apiError) {
                        console.error(`Error fetching via GitHub API: ${apiError}`);
                        // Fall back to proxy method
                        imageUrl = `${corsProxies[currentProxyIndex]}https://github.com/${username}.png`;
                    }
                } else {
                    // CORS proxy method
                    imageUrl = `${corsProxies[currentProxyIndex]}https://github.com/${username}.png`;
                }

                const img = new Image();

                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        // Only add images that loaded correctly
                        images.push({
                            element: img,
                            username: username
                        });
                        resolve();
                    };
                    img.onerror = () => {
                        failedImages.push(username);
                        // Try another proxy if this one failed
                        if (!useGithubAPI) {
                            currentProxyIndex = (currentProxyIndex + 1) % corsProxies.length;
                        }
                        resolve(); // Don't reject, continue with other images
                    };
                    img.crossOrigin = 'anonymous';
                    img.src = imageUrl;

                    // Set a timeout in case the image load hangs
                    setTimeout(() => {
                        resolve();
                    }, 5000);
                });
            } catch (error) {
                console.error(`Error fetching ${username}'s avatar:`, error);
            }
        }

        if (failedImages.length > 0) {
            showStatus(`Could not load images for: ${failedImages.join(', ')}`, 'error');
        }

        return images;
    }

    function createCollage(images) {
        const imageCount = images.length;
        const gridSize = calculateGridSize(imageCount);
        const cellSize = 200; // Each image cell size

        // Set canvas size based on grid
        canvas.width = gridSize.cols * cellSize;
        canvas.height = gridSize.rows * cellSize;

        // Clear canvas with transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw images in a grid
        images.forEach((image, index) => {
            const row = Math.floor(index / gridSize.cols);
            const col = index % gridSize.cols;

            const x = col * cellSize;
            const y = row * cellSize;

            ctx.save();

            // Create circular clip for the avatar
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 10, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            // Draw the image
            ctx.drawImage(image.element, x, y, cellSize, cellSize);

            // Restore context for next drawing
            ctx.restore();

            // Username display removed as requested
        });
    }

    function calculateGridSize(count) {
        // Calculate optimal grid dimensions based on image count
        const sqrt = Math.sqrt(count);
        const cols = Math.ceil(sqrt);
        const rows = Math.ceil(count / cols);

        return { rows, cols };
    }

    function downloadCollage() {
        // Use toDataURL with PNG format and transparency enabled
        const link = document.createElement('a');
        link.download = 'github-profile-collage.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function showStatus(message, type) {
        statusEl.textContent = message;
        statusEl.className = 'mt-4 h-6 font-medium';

        if (type === 'error') {
            statusEl.classList.add('text-red-600');
        } else if (type === 'success') {
            statusEl.classList.add('text-green-600');
        }
    }
});
