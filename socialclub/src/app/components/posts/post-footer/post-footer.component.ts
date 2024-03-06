import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { LikeService } from '../../../services/like.service';
// import { CommentService } from '../../../services/comment.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    // Assuming you want to fetch and display existing comments when the component is initialized
    this.fetchComments();
  }
  likePost() {
    this.likeService.likePost(this.postId, this.userId).subscribe(
      (response) => {
        console.log('Post liked successfully!', response);
        // You can handle success response here
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
    this.router.navigate(['/report']);
  }
  submitComment() {
    alert('Comment posted successfully!');
    // Assuming you have the postId available, replace 'postId' with the actual postId
    const postId = this.postId; // Replace with the actual post ID
    const userId = this.userId;
    console.log(userId, 'user id');
    console.log('userid: ' + userId + ', postid: ' + postId);

    this.commentService.postComment(userId, postId, this.comment).subscribe(
      (response) => {
        console.log('Comment posted successfully:', response);
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
    this.commentService.getComments(postId).subscribe(
      (data) => {
        // Assuming your comments are stored as strings, adjust based on your actual data structure
        this.commentsWithUsername = []; // Clear the array before fetching new comments
        console.log('comments for', postId, data);

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
