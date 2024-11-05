import {IUserPublicData} from "@/types/stores";

interface IUserDefaultData extends IUserPublicData {
    id: number
}

interface IUserExtendedData extends IUserDefaultData {
    posts_count: number,
    is_followed: boolean,
    followers_count: number,
    followings_count: number
}

interface IUserFollowData {
    id: number,
    posts_count: number,
    is_followed: boolean,
    followers_count: number,
    followings_count: number,
    follower?: IUserDefaultData,
    following?: IUserDefaultData
}

interface IDateTime {
    time_added: string,
    timezone: string
}

interface IDefaultInstance {
    id: number,
    author: IUserDefaultData,
    time_added: IDateTime,
    is_liked: boolean,
    likes_count: number
}

interface IComment extends IDefaultInstance {
    post: number,
    comment: string
}

interface IImage {
    id: number,
    image: string,
    image_crop: string
}

interface IPost extends IDefaultInstance {
    signature: string,
    images: Array<IImage>,
    comments_count: number,
    is_commented: boolean,
    is_saved: boolean,
    activeImage?: number,
    isModalVisible?: boolean
}

enum Tops {
    RECENT = 'recent',
    UPDATES = 'updates',
    LIKES = 'likes'
}

export {
    IUserDefaultData,
    IUserExtendedData,
    IComment,
    IPost,
    Tops,
    IUserFollowData
}
