const {listingSchema,reviewSchema}=require("../schema.js");

const Listing=require("../models/listing")

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});


}
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
   const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
   if(!listing)
   {
        req.flash("error","Listing you requested doesn't exist");
       return res.redirect("/listings")
   }
   console.log(listing);
   res.render("listings/show.ejs",{listing});

}
module.exports.createListing=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
   let result= listingSchema.validate(req.body);
    if (result.error) {
        console.log("Joi found errors:");
        console.log(result.error.details); // This will show all validation errors
    } else {
        console.log("No validation errors. Joi is working!");
    }

    
  const newListing=new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image={url,filename};
  await newListing.save();

  req.flash("success","New Listing Created!");
  res.redirect("/listings")
   // let {title,description,imag,price,country,location}=req.body;
    
}
module.exports.renderEditForm=async(req,res)=>{
    
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing)
   {
        req.flash("error","Listing you requested doesn't exist");
       return res.redirect("/listings")
   }
    res.render("listings/edit.ejs",{listing});
}
module.exports.updateListing=async(req,res)=>{

    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");

    }
      let {id}=req.params;
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file !=="underdefined"){
       let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  req.flash("success","Listing Updated")
  res.redirect(`/listings/${id}`);
}
module.exports.deletelisting=async(req,res)=>{
    let {id}=req.params;
  
   let deletedListing=await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing deleted")
   res.redirect("/listings");
}

