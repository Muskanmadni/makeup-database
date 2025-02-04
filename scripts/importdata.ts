import axios from 'axios';
import { client } from '../sanityClient.js'; // Import your Sanity client
import slugify from 'slugify';

async function uploadImageToSanity(imageUrl:any) {
    try {
        console.log("Fetching image:", imageUrl);
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 10000 });
        console.log("Image fetch successful:", imageUrl, response.status);
        const buffer = Buffer.from(response.data);

        const asset = await client.assets.upload('image', buffer, {
            filename: imageUrl.split('/').pop(),
        });

        console.log('Image uploaded successfully:', asset);
        return asset._id;
    } catch (error) {
        console.error('❌ Failed to fetch/upload image:', imageUrl);
        return null;
    }
}

async function createCategory(category:any, counter:any) {
    try {
        console.log("Creating category:", category);
        const categoryExist = await client.fetch(`*[_type=="category" && slug==$slug][0]`, { slug: category.slug });
        console.log("Category exists check:", categoryExist);

        if (categoryExist) {
            return categoryExist._id;
        }

        const catObj = {
            _type: "category",
            _id: category.slug + "-" + counter,
            name: category.name,
            slug: category.slug
        };

        const response = await client.createOrReplace(catObj);
        console.log('Category created successfully', response);
        return response._id;
    } catch (error) {
        console.error('❌ Failed to create category:', category.name, error);
        return null; // Return null on error
    }
}

async function importData() {
    try {
        const response = await axios.get('https://makeup-api.herokuapp.com/api/v1/products.json');
        const products = response.data;

        console.log("Raw API Data:", products);
        if (!Array.isArray(products)) {
            console.error("API data is not an array. Check API response format.");
            return;
        }

        let counter = 1;
        for (const product of products) {
            console.log("Processing product:", product);

            if (!product || !product.name) {
                console.error("Product or name is missing:", product);
                continue;
            }
            if (!product.category || !product.category.name) {
                console.error("Category or category name is missing:", product);
                product.category = { name: "Uncategorized" }; // Or skip with 'continue'
            }

            let imageRef = null;
            let catRef = null;

            if (product.image) {
                try {
                    imageRef = await uploadImageToSanity(product.image);
                } catch (imageError) {
                    console.error("Error uploading image for product", product.name, imageError);
                }
            }

            try {
                catRef = await createCategory(product.category, counter);
            } catch (catError) {
                console.error("Error creating category for product", product.name, catError);
            }

            const sanityProduct = {
                _id: `product-${counter}`,
                _type: 'product',
                name: product.name,
                slug: {
                    _type: 'slug',
                    current: slugify(product.name, { lower: true, strict: true }),
                },
                price: product.price,
                category: catRef ? { _type: 'reference', _ref: catRef } : undefined,
                tags: product.tags || [],
                quantity: 50,
                image: imageRef ? { _type: 'image', asset: { _type: 'reference', _ref: imageRef } } : undefined,
                description: product.description || "A timeless design...",
                features: product.features || ["Premium material..."],
                dimensions: product.dimensions || { _type: 'dimensions', height: "110cm", width: "75cm", depth: "50cm" },
            };

            console.log('Uploading product:', sanityProduct);

            try {
                await client.createOrReplace(sanityProduct);
                console.log(`✅ Imported product: ${sanityProduct.name}`);
            } catch (sanityError) {
                console.error("Error creating/replacing Sanity product:", sanityProduct, sanityError);

            }
            counter++;
        }

        console.log('✅ Data import completed!');
    } catch (error) {
        console.error('❌ Error importing data:', error);
    }
}

importData();