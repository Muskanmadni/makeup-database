// sanityClient.ts
import {config} from 'dotenv';
import { createClient } from '@sanity/client';


config()
export const client = createClient({
  projectId:"u0clzjji", // Replace with your project ID
  dataset:"production",        // Or your dataset name
  apiVersion: '2025-01-29',     // Today's date or latest API version
  useCdn: false,                // Disable CDN for real-time updates
  token:"skmMILSLN5T0sbV9iClh5qKgiQPhxbe6HmxCNzB0OODiafoEKTGuWXZM0Dt8RU2smH0ciXFtalqX0QxyE9McZ4LfHAcFeSLCd2JJjztKQJ9e79xHpC8w9puvzrJGQSTIxrgbIAiDDQ9LtCbNdzaORu7mjIlDR5Hmi9zubYViaS70KW3OnNv1",
});