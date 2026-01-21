export interface Notice{
    id: string;
    title: string;
    content: string;
    author: string;
    is_pinned: boolean;
    views: number;
    is_show: boolean;
    created_at: string;
};

export const NewNotice =  () => {
    return {
        title: "",
        content: "",
        author: "",
        is_pinned: false,
        views: 0,
        is_show: true
    }
}