export default {
  name: 'post',
  schema: {
    title: String,
    description: String,
    body: String,
    path: String,
    tags: [String],
    views: Number,
    draft: Boolean,
    customStyles: String,
    imagesWidth: Number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    publishedAt: Date,
    translations: [String],
  },
};
