const mongoose=require("mongoose");
const review = require("./review");
const Schema  = mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename: {
            type: String,
          },
          url: {
            type: String,
            default:
              "https://www.komandoo.com/wp-content/uploads/2022/05/KOM_Jacuzzi-beach-villa_Aerial-18_1600x900.jpg",
            set: (v) =>
              v === ""
                ? "https://www.komandoo.com/wp-content/uploads/2022/05/KOM_Jacuzzi-beach-villa_Aerial-18_1600x900.jpg"
                : v,
          }, 
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      }
    ]
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;