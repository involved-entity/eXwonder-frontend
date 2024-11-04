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

interface IDefaultInstance {
    id: number,
    author: IUserDefaultData,
    time_added: string,
    is_liked: boolean,
    likes_count: number
}

interface IComment extends IDefaultInstance {
    post: number,
    comment: string
}

interface IPost extends IDefaultInstance {
    signature: string,
    images: Array<string>,
    comments_count: number,
    is_commented: boolean,
    is_saved: boolean
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
    Tops
}
