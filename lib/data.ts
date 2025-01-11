import {prisma} from '@/lib/prisma';

export const getImages = async () => {
    try {
        const result = await prisma.upload.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error('Failed to fetch images');
    }
}

export const getImagesById = async (id: string) => {
    try {
        const result = await prisma.upload.findMany({
            where: {
                id,
            },
        });
        return result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error('Failed to fetch images');
    }
}