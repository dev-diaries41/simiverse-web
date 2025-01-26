export const generateDownloadLink = (data: any, type: string): string => {
    let content: string;
  
    // Process the data based on the MIME type
    switch (type) {
      case "application/json":
        content = JSON.stringify(data, null, 2); // Format JSON data with indentation
        break;
      case "text/csv":
        if (Array.isArray(data)) {
          // Convert array of objects to CSV
          const keys = Object.keys(data[0]); // Extract column headers
          const rows = data.map((row) => keys.map((key) => row[key]).join(","));
          content = [keys.join(","), ...rows].join("\n");
        } else {
          throw new Error("CSV export requires an array of objects.");
        }
        break;
      case "text/plain":
        content = typeof data === "string" ? data : String(data); // Convert non-string data to string
        break;
      default:
        throw new Error(`Unsupported MIME type: ${type}`);
    }
  
    // Create a Blob with the processed content and MIME type
    const blob = new Blob([content], { type });
  
    // Generate and return the object URL
    return URL.createObjectURL(blob);
  };
  