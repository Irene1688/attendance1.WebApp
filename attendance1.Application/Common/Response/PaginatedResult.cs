namespace attendance1.Application.Common.Response
{
    public class PaginatedResult<T>
    {
        public IEnumerable<T> Data { get; set; }
        public int TotalCount { get; set; } 
        public int PageNumber { get; set; } 
        public int PageSize { get; set; }
        public int TotalPages { get; set; } 
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }

        public PaginatedResult(IEnumerable<T> data, int totalCount, int pageNumber, int pageSize)
        {
            Data = data;
            TotalCount = totalCount;
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            HasNextPage = pageNumber < TotalPages;
            HasPreviousPage = pageNumber > 1;
        }
    }

}
