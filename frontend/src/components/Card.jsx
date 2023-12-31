/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { AiFillLike, AiFillEdit, AiTwotoneDelete, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { BiSolidComment } from 'react-icons/bi'
import { BsDot } from 'react-icons/bs'

import "./CardStyles.css"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import backend_ref from './BackendRef'
import { useEffect, useState } from 'react'
import { addData } from '../Store/slice/AllPostSlice'
const Card = (props) => {
    const dispatch = useDispatch()
    const navigateTo = useNavigate()
    let user = useSelector((store) => (store.user.data))
    const [comment, setComment] = useState('')
    const [commentBar, setCommentBar] = useState('none')
    let { date, post, gender, id, username, likes, comments, likeCount, commentCount, liked, displayPower } = props
    let [inputPost, setInputPost] = useState(post)
    let [showInputPost, setShowInputPost] = useState(null)
    const [data, setData] = useState({
        date: date,
        post: post,
        gender: gender,
        id: id,
        username: username,
        likes: likes,
        comments: comments,
        likeCount: likeCount,
        commentCount: commentCount,
        liked: liked
    })

    useEffect(() => {
        setData({
            date: date,
            post: post,
            gender: gender,
            id: id,
            username: username,
            likes: likes,
            comments: comments,
            likeCount: likeCount,
            commentCount: commentCount,
            liked: liked
        })
    }, [commentCount, comments, date, gender, id, likeCount, liked, likes, post, props, username])




    const handleLike = async () => {

        if ('username' in user) {
            const like = await axios.post(backend_ref + '/like', { data: { id: id, myUsername: user.username, postUsername: username } })
            setData(prevValue => ({
                ...prevValue,
                ...like.data
            }))
        }

        else {
            toast('Login First!')
            navigateTo('/login')
        }

    }



    const handleComment = async (e) => {
        e.preventDefault()
        if ('username' in user) {
            const commentCheck = await axios.post(backend_ref + '/comment', { data: { id: id, myUsername: user.username, postUsername: username, comment: comment, gender: user.gender } })
            const newLikes = await axios.post(backend_ref + '/getstats', { data: { id: data.id } })
            setData((prevValue) => ({ ...prevValue, likes: newLikes.data.likes, comments: newLikes.data.comments, likeCount: newLikes.data.likeCount, commentCount: newLikes.data.commentCount, liked: newLikes.data.liked }))
            toast('Comment added Sucessfully!')
            setComment('')
            navigateTo('/')
        }
        else {
            toast('Login First!')
            navigateTo('/login')
        }
    }

    const handleCommentChange = (e) => {
        setComment(e.target.value)
    }

    const handleCommentBar = () => {
        if (commentBar === 'none')
            setCommentBar('flex')
        else
            setCommentBar('none')
    }

    const handleDeletePost = async () => {
        if ('username' in user) {
            const deletePost = await axios.post(backend_ref + '/deletePost', { data: { username: user.username, postId: data.id } })
            if (deletePost.data) {
                dispatch(addData(deletePost.data))
                toast('Post deleted Sucessfully')
            }
            else {
                toast('Sorry, Try again later!')
            }
            
        }
    }
    
    const handleEditPost = async () => {
        const editPost = await axios.post(backend_ref + '/editPost', { data: { username: user.username, postId: data.id, newPost: inputPost } })
        if (editPost.data) {
            dispatch(addData(editPost.data))
            toast('Post uodated Sucessfully')
            handleShowEditPost()
        }
        else
            toast('Post ')
    }

    const handleShowEditPost = () => {
        if (showInputPost === null) {
            setShowInputPost(true)
        }
        else
            setShowInputPost(null)
    }

    const handleInputPostChange = (e) => {
        let { value } = e.target
        console.log(value);
        setInputPost(value)
    }


    return (
        <div className="card">
            <div className="card-header">
                <div className='card-user'>
                    <img src={`/assets/${data.gender}.png`} alt="" />
                    <p>{data.username}</p>
                </div>
                <div className='card-date'>
                    <BsDot />
                    <p>{date}</p>
                </div>
            </div>
            <div className='card-post-wrapper'>

                <div className='card-post'>
                    <div className="post-text">
                        {(showInputPost) ?
                            <textarea value={inputPost} name='inputPost' onChange={handleInputPostChange} />
                            :
                            <p dangerouslySetInnerHTML={{__html: (data.post).replace(/\n/g, '<br>')}}/>
                        }
                    </div>
                    <div className='like-comment-edit'>
                        <div className='like-comment'>
                            <div className='likes'>
                                <AiFillLike name='like' style={{ color: (data.liked === true) ? '#0072E8' : '#ffffff' }} onClick={handleLike} />
                                <p>{data.likeCount}</p>
                            </div>
                            <div className='comments'>
                                <BiSolidComment name='comment' onClick={handleCommentBar} />
                                <p>{data.commentCount}</p>
                            </div>
                        </div>
                        {(displayPower) &&
                            <div className='edit-delete'>
                                {(showInputPost) ?
                                    <>
                                        <AiOutlineCheck onClick={handleEditPost} />
                                        <AiOutlineClose onClick={handleShowEditPost} />
                                    </>
                                    :
                                    <>
                                        <AiFillEdit onClick={handleShowEditPost} />
                                        <AiTwotoneDelete onClick={handleDeletePost} />
                                    </>
                                }
                            </div>
                        }
                    </div>
                </div>

                <div style={{ display: commentBar }} className='comments-cover'>
                    <form onSubmit={handleComment}>
                        <input type="text" onChange={handleCommentChange} value={comment} />
                        <button type='submit'>Post</button>
                    </form>
                    {((data.comments).map(element => {
                        return (
                            < div key={element.uniqueId} className='other-comments'>
                                <div className='other-profile'>
                                    <img src={(element.gender === 'male') ? '/assets/man.png' : '/assets/woman.png'} alt="" />
                                </div>
                                <div className='other-comment-text'>
                                    <p>{element.username}</p>
                                    <p>
                                        {element.comment}
                                    </p>
                                </div>
                            </div>
                        )
                    }))
                    }

                </div>


            </div>

        </div >
    )
}
export default Card