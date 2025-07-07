// js/appwrite.js
const AppwriteClient = ((endpoint, project, database, collection) => {
    const { Client, Databases } = Appwrite;

    const client = new Client();
    client.setEndpoint("https://YOUR_APPWRITE_ENDPOINT")
          .setProject("YOUR_PROJECT_ID");

    const databases = new Databases(client);

    async function submitForm(data) {
        try {
            const response = await databases.createDocument(
                "YOUR_DATABASE_ID",
                "YOUR_COLLECTION_ID",
                "unique()",
                data
            );
            return response;
        } catch (error) {
            console.error("Appwrite Error:", error);
            return null;
        }
    }

    return { submitForm };
})();

export default AppwriteClient;