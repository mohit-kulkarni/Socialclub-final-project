import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'], 
})
export class SearchComponent {
  searchControl = new FormControl();
  searchResults: any[] = [];

  constructor(private searchService: SearchService) {
    this.setupSearch();
  }
  // ngOnInit(){
  //     this.SearchService.searchUsers().subscribe((data:any[])=>{
  //       this.searchResults=data;
  //       console.log(this.searchResults,"hello")
  //     })
  //   }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(query => this.searchService.searchUsers(query)),
        map(results => this.filterResults(results)) // Filter the results
      )
      .subscribe(filteredResults => {
        this.searchResults = this.searchControl.value ? filteredResults : [];
      });
  }

  private filterResults(results: any[]): any[] {
    const query = this.searchControl.value.toLowerCase();
    return results.filter(result => result.username.toLowerCase().includes(query));
  }
}
