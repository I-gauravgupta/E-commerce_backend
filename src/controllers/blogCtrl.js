const {Blog} = require("../models/blogModel");
const User = require("../models/userModel");
const isValidId= require("../utils/idValidation");

const {uploadOnCloudinary}=require("../utils/cloudinary");
const{blogImageResize}=require("../middlewares/uploadBlogImage");

const createBlog=async(req,res)=>{
    try {
        const blog = await new Blog(req.body);
        const newBlog = await blog.save();
        res.json({msg:"blog created",newBlog })
    } catch (error) {
        console.log(error);
    }
    
}

// update blog
const updateBlog= async(req,res)=>{
    try {
        const id = req.query.id;
        const updated = await Blog.findByIdAndUpdate(id,req.body,{new:true}); 
        res.json(updated);
    } catch (error) {
        console.log(error);
    }
}

// get a blog and increase its view count
const getBlog = async (req, res) => {
    const { id } = req.query;
    try {
      const getBlog = await Blog.findById(id);
      const updateViews = await Blog.findByIdAndUpdate(
        id,
        {
          $inc: { numViews: 1 },
        },
        { new: true }
      ).populate("likes").populate("dislikes")              // populate - likes me id ki jagah user deatils show karega
      res.json(updateViews);
    } catch (error) {
      throw new Error(error);
    }
  };


  //get all blogs
  const getAllBlogs = async (req, res) => {
    try {
      const getBlogs = await Blog.find();
      res.json(getBlogs);
    } catch (error) {
      throw new Error(error);
    }
  };

// delete blog

const deleteBlog= async(req,res)=>{
    try {
        const id = req.query.id;
        const deleted = await Blog.findByIdAndUpdate(id,req.body,{new:true}); 
        res.json(deleted);
    } catch (error) {
        console.log(error);
    }
}

const likeblog=async(req,res)=>{
    try {
        const blogId = req.query.blogId;
        const UserId = req.userPayload.payload.id;
        const blog = await Blog.findById(blogId);
        // yaha dekh rhe ki -kisi bhi user ne blog like kiya hai ya nhai
        const isLiked = blog?.isLiked;
        // user ne blog dislike to nahi kar rakha hai
        const alreadyDisliked = blog?.dislikes?.find(
              (Id) => Id?.toString() === UserId?.toString());
        // agar kar rakha hai 
        if (alreadyDisliked) {
              const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $pull: { dislikes:UserId },
                  isDisliked: false,
                },
                { new: true }
              );
              res.json(blog);
            }
        // blog is liked by any user > checking is liked by current user or not > if yes then remove its like
            if (isLiked) {
              const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $pull: { likes:UserId },
                  isLiked: false,
                },
                { new: true }
              );
              res.json(blog);
            } else {                                                    // add user like
              const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $push: { likes:UserId },
                  isLiked: true,
                },
                { new: true }
              );
              res.json(blog);
            }
    } catch (error) {
        throw new Error(error);
    }
}

// dislike a blog
const dislikeblog=async(req,res)=>{
    try {
        const blogId = req.query.blogId;
        const UserId = req.userPayload.payload.id;
        const blog = await Blog.findById(blogId);
        // yaha dekh rhe ki -kisi bhi user ne blog dislike kiya hai ya nhai
        const isDisliked = blog?.isDisliked;
        // user ne blog like to nahi kar rakha hai
        const alreadyLiked = blog?.likes?.find(
              (Id) => Id?.toString() === UserId?.toString());
        // agar kar rakha hai 
        if (alreadyLiked) {
              const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $pull: { likes:UserId },
                  isLiked: false,
                },
                { new: true }
              );
              res.json(blog);
            }
        // blog is disliked by any user > checking is liked by current user or not > if yes then remove its dislike
            if (isDisliked) {
              const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $pull: { dislikes:UserId },
                  isDisliked: false,
                },
                { new: true }
              );
              res.json(blog);
            } else {                                                    // add user dislike
              const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                  $push: { dislikes:UserId },
                  isDisliked: true,
                },
                { new: true }
              );
              res.json(blog);
            }
    } catch (error) {
        throw new Error(error);
    }
}
// upload image
const uploadImage=async(req,res)=>{
  const urls =[];
  try {
      const blogId= req.query.blogId;
      for(const file of req.files){
          const img= file.path;
          const {filename}=file;
          await blogImageResize(img,filename)
          const response= await uploadOnCloudinary(path.join(__dirname, "../uploads/blogs",`resized_${filename}`));
          urls.push(response);
      }
      const blog = await Blog.findByIdAndUpdate(
          prodId,
          {
            $push: {
              images: { $each: urls }
            }
          },
          { new: true } 
        );
      res.json(blog);
  } catch (error) {
      throw new Error(error);
  }
}



module.exports={createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog,likeblog,dislikeblog,uploadImage};