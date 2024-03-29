import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { LikeService } from '../../../services/like.service';
// import { CommentService } from '../../../services/comment.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';
import { PostService } from '../../../services/post.service';
import { BookmarkService } from '../../../services/bookmark.service';
import { formatDistanceToNow } from 'date-fns';
import Swal from 'sweetalert2';

CommentService;
@Component({
  selector: 'app-post-footer',
  templateUrl: './post-footer.component.html',
  styleUrl: './post-footer.component.scss',
})
export class PostFooterComponent implements OnInit {
  @Input() postId!: number;
  @Input() username!: any;
  @Input() caption: string;
  @Input() imgIsPresent: string;
  @Input() isLiked: boolean;
  @Input() created_at: Date;

  userId: any = sessionStorage.getItem('userId');

  pulse: boolean = false;
  saveChecked: boolean = false;
  likeChecked: boolean = false;
  likeUserImage: string;
  likeUserName: string;
  likeCount: number;
  comment: string = '';
  comments: string[] = [];
  commentsWithUsername: any[];

  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private likeService: LikeService,
    private postService: PostService,
    private bookmarkService: BookmarkService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Assuming you want to fetch and display existing comments when the component is initialized
    this.fetchComments();
    this.fetchLikeCount();
    this.checkLikedState();

    setInterval(() => {
      this.getRelativeTime();
    }, 60000);
  }

  getRelativeTime() {
    return formatDistanceToNow(this.created_at, { addSuffix: true });
  }

  checkLikedState() {
    // Check if the post is liked by this user
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    this.likeChecked = !!likedPosts[this.postId];
  }
  updateLikedState(isLiked: boolean) {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    if (isLiked) {
      likedPosts[this.postId] = true;
    } else {
      delete likedPosts[this.postId];
    }
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    this.likeChecked = isLiked;
  }
  fetchLikeCount(): void {
    this.postService.getPostById(this.postId).subscribe(
      (response) => {
        // console.log('Post liked successfully!', response);
        this.likeCount = response.likes_count;
        // You can handle success response here
      },
      (error) => {
        console.error('Error while liking post:', error);
        // You can handle error here
      }
    );
  }
  likePost() {
    this.likeService.likePost(this.postId, this.userId).subscribe(
      (response) => {
        // console.log('Post liked successfully!', response);
        // You can handle success response here
        this.updateLikedState(true);
        this.fetchLikeCount();
      },
      (error) => {
        console.error('Error while liking post:', error);
        // You can handle error here
      }
    );
  }

  changeLikeCheckedValue() {
    this.pulse = true;
    this.likeChecked = !this.likeChecked;
    setTimeout(() => (this.pulse = false), 300);
  }

  redirectToReportForm() {
    // Navigate to the report form component
    this.router.navigate(['/report', this.postId]);
  }
  submitComment() {
    // alert('Comment posted successfully!');
    Swal.fire({
      title: 'Success!',
      text: 'Comment posted successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
    });
    // Assuming you have the postId available, replace 'postId' with the actual postId
    const postId = this.postId; // Replace with the actual post ID
    const userId = this.userId;
    // console.log(userId, 'user id');
    // console.log('userid: ' + userId + ', postid: ' + postId);

    this.commentService.postComment(userId, postId, this.comment).subscribe(
      (response) => {
        // console.log('Comment posted successfully:', response);
        this.comments.push(`${this.comment}`);
        this.comment = ''; // Clear the input field after posting
      },
      (error) => {
        console.error('Error posting comment:', error);
      }
    );
  }

  fetchComments() {
    const postId = this.postId;
    // console.log(`PostID: ${postId}`);

    this.commentService.getComments(postId).subscribe(
      (data) => {
        // Assuming your comments are stored as strings, adjust based on your actual data structure
        this.commentsWithUsername = []; // Clear the array before fetching new comments
        // console.log('comments for', postId, data);

        data.forEach((comment) => {
          // Fetch the username for each comment
          this.fetchUsernameFromId(comment.user).then((username) => {
            // Separate the username and comment text
            const commentWithUsername = {
              username: username,
              text: comment.text,
            };
            this.commentsWithUsername.push(commentWithUsername);
          });
        });
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  bookmarkPost() {
    this.bookmarkService.bookmarkPost(this.postId, this.userId).subscribe(
      (response) => {
        console.log('Post bookmarked successfully:', response);
        Swal.fire({
          title: 'Success!',
          text: 'Post bookmarked successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        // alert(`Bookmarked Successfully!!`);
        // Handle success (e.g., show a success message)
      },
      (error) => {
        console.error('Error bookmarking post:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Post already bookmarked!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        // Handle error (e.g., show an error message)
      }
    );
  }

  toggleBookmark() {
    console.log(this.saveChecked);

    this.saveChecked = !this.saveChecked;
    console.log(this.saveChecked);
  }

  private async fetchUsernameFromId(userId: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.userService.getUserById(userId).subscribe(
        (user: User) => {
          resolve(user.username);
        },
        (error) => {
          console.error('Error fetching user details:', error);
          reject(error);
        }
      );
    });
  }
}
