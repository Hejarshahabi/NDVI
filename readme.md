# NDVI Calculation and Export for Quebec Province

This script calculates the Normalized Difference Vegetation Index (NDVI) for the Quebec province using Sentinel-2 surface reflectance data for the summer months (June, July, August) over the past five years (2019-2023). The calculated NDVI is then divided into smaller parts, and each part is exported as a GeoTIFF file.

## Overview

NDVI is a widely used vegetation index that measures the difference between near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs). This index helps in understanding the density and health of vegetation in a specific area.

### Key Steps in the Script

1. **Load the Quebec Boundary**: The boundary of Quebec is loaded as a `FeatureCollection` to define the study area.
2. **Filter Sentinel-2 Data**: Sentinel-2 surface reflectance data is filtered based on the Quebec boundary, date range, and cloud cover.
3. **Calculate NDVI**: The NDVI is calculated for each image in the filtered dataset.
4. **Compute Mean NDVI**: The mean NDVI over the entire time period is computed.
5. **Divide the Area into Smaller Parts**: The Quebec region is divided into smaller bounding boxes to handle large datasets and make the export process manageable.
6. **Export NDVI as GeoTIFF**: Each smaller part of the NDVI map is exported as a separate GeoTIFF file to Google Drive.

## Usage

1. **Load the Script**: Copy and paste the script into the Google Earth Engine (GEE) code editor.
2. **Run the Script**: The script will calculate the NDVI for the Quebec region and display the bounding boxes on the map.
3. **Export Results**: The script automatically exports the NDVI results as GeoTIFF files to your Google Drive.

### Parameters to Modify

- **Date Range**: You can change the `startDate` and `endDate` to focus on a different time period.
- **Cloud Masking**: Adjust the cloud probability threshold in the `cloudMask` variable if needed.
- **Number of Parts**: Modify the `numX` and `numY` variables in the `createBoundingBox` function to change the number of parts the region is divided into.

## Why Divide NDVI into Smaller Parts?

Quebec is a large province, and processing or exporting NDVI data for the entire region as a single file can be computationally intensive and may exceed Earth Engine's processing limits. By dividing the area into smaller parts:

- **Manageability**: Each part can be processed and exported separately, reducing the risk of hitting memory or processing limits.
- **Efficiency**: Smaller parts can be handled more efficiently by Google Earth Engine, making the overall process faster and more reliable.
- **Parallel Processing**: You can process and analyze smaller sections individually, allowing for more focused analysis.

## Requirements

- **Google Earth Engine Account**: You need access to the Google Earth Engine platform.
- **Google Drive**: The script exports files to Google Drive, so ensure you have enough storage space.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- Hejar Shahabi

