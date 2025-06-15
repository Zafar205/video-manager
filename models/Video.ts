import mongoose, {Schema, model, models} from "mongoose";

export const VIDEO_DIM = {
    width : 1080,
    height : 1920
} as const


export interface type_video {
    _id? : mongoose.Types.ObjectId;
    title : string;
    description : string;
    videoURL : string;
    thumbnailURL : string;
    controls? : boolean;
    transformation? : {
        height : number;
        width : number;
        quality : number;
    };
}

const videoSchema = new Schema<type_video>(
    {
        title : {type: String, required: true },
        description : {type: String, required: true },
        videoURL : {type: String, required: true },
        thumbnailURL : {type: String, required: true },
        controls : {type: Boolean, default: true },
        transformation : {
            height : {type : Number, default : VIDEO_DIM.height},
            width : {type : Number, default : VIDEO_DIM.width},
            quality : {type : Number, min : 1, max : 100 }
        }
    },
    {
        timestamps : true
    })
// why create new model every time, so check if the model has one, if not create one and have it
const  Video = models.Video || model<type_video>("Video", videoSchema)
export default Video