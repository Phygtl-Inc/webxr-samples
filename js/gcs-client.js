/**
 * GCSClient - A simple client for accessing Google Cloud Storage using signed URLs
 */
class GCSClient {
    /**
     * Create a new GCS client
     * @param {string} apiBaseUrl - The base URL of your signed URL API service
     */
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    /**
     * Get a signed URL for the specified object
     * @param {string} bucketName - The name of the GCS bucket
     * @param {string} objectName - The name of the object
     * @returns {Promise<string>} - The signed URL
     */
    async getSignedURL(bucketName, objectName) {
        try {
            // Call the existing endpoint
            const response = await fetch(`${this.apiBaseUrl}/getSignedURL`);

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
     * Check if a file exists in the specified bucket
     */
    async fileExists(bucketName, objectName) {
        try {
            // Get the signed URL
            const signedUrl = await this.getSignedURL(bucketName, objectName);

            // Make a HEAD request to check if the file exists
            const response = await fetch(signedUrl, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error('Error checking if file exists:', error);
            return false;
        }
    }

    /**
     * Download a file from GCS
     */
    async downloadFile(bucketName, objectName) {
        try {
            // Get the signed URL
            const signedUrl = await this.getSignedURL(bucketName, objectName);

            // Download the file using the signed URL
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
