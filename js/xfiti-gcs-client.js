/**
 * XfitiGCSClient - A client for accessing 3D assets from Xfiti using signed URLs
 */
class XfitiGCSClient {
    /**
     * Create a new Xfiti GCS client
     * @param {string} apiBaseUrl - The base URL of your API service
     * @param {string} authToken - The authentication token for the API
     */
    constructor(apiBaseUrl, authToken) {
        this.apiBaseUrl = apiBaseUrl;
        this.authToken = authToken;

        console.log(`XfitiGCSClient initialized with API base URL: ${this.apiBaseUrl} and auth token: ${this.authToken}`);
    }

    /**
     * Get a signed URL for the specified asset ID
     * @param {string} assetId - The ID of the 3D asset
     * @returns {Promise<string>} - The signed URL
     */
    async getSignedURL(assetId) {
        console.log(`XfitiGCSClient.getSignedURL(assetId=${assetId})`);
        try {
            // Set up headers with authentication
            const headers = {
                'accept': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            };

            // Call the endpoint with the asset ID
            const response = await fetch(`${this.apiBaseUrl}/${assetId}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`Failed to get signed URL: ${response.statusText}`);
            }

            // The endpoint returns the signed URL directly
            return await response.text();
        } catch (error) {
            console.error('Error getting signed URL:', error);
            throw error;
        }
    }

    /**
     * Check if the file exist without downloading it
     * @param {string} signedUrl - The signed URL of the asset
     * @returns {Promise<boolean>} - Whether the asset exists
     */
    async fileExists(signedUrl) {
        try {
            const response = await fetch(signedUrl, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error('Error checking if file exists:', error);
            return false;
        }
    }

    /**
     * For backwards compatibility with existing code
     * @param {string} assetId - The ID of the 3D asset
     * @returns {Promise<ArrayBuffer>} - The file data
     */
    async downloadFile(assetId) {
        try {
            const signedUrl = await this.getSignedURL(objectName);
            const response = await fetch(signedUrl);

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
            }

            return await response.arrayBuffer();
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    }
}
