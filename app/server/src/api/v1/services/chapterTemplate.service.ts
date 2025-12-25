import ChapterTemplate, { IChapterTemplate } from "../models/chapterTemplate.model";
import Category from "../models/category.model";



export const createChapterTemplate = async (data) => {
    // 🔹 count existing chapters in category
    const category = await Category.findById(data.category).select("chapters");

    const nextIndex = category?.chapters?.length || 0;


    const chapter = await ChapterTemplate.create({
        ...data,
        index: nextIndex,
    });

    await Category.findByIdAndUpdate(
        data.category,
        { $push: { chapters: chapter._id } }
    );

    return chapter;
};




export const updateChapterTemplate = async (id, data) => {
    const existing = await ChapterTemplate.findById(id);
    if (!existing) throw new Error("Chapter not found");

    if (data.category && existing.category.toString() !== data.category.toString()) {
        await Category.findByIdAndUpdate(
            existing.category,
            { $pull: { chapters: existing._id } }
        );

        await Category.findByIdAndUpdate(
            data.category,
            { $push: { chapters: existing._id } }
        );
    }

    return ChapterTemplate.findByIdAndUpdate(id, data, { new: true });
};


export const deleteChapterTemplate = async (id) => {
    const chapter = await ChapterTemplate.findById(id);
    if (!chapter) throw new Error("Chapter not found");

    await Category.findByIdAndUpdate(
        chapter.category,
        { $pull: { chapters: chapter._id } }
    );

    await chapter.deleteOne();

    return { success: true };
};



export const getChaptersByCategoryId = async (categoryId: string) => {
    return ChapterTemplate.find({ category: categoryId })
        .sort({ index: 1 })
        .lean();
};
