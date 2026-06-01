namespace UpscMentorship.Shared.Responses;

/// <summary>
/// Generic API response wrapper for all endpoint responses.
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public IEnumerable<string>? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Success") 
        => new() { Success = true, Data = data, Message = message };

    public static ApiResponse<T> Failure(string message, IEnumerable<string>? errors = null) 
        => new() { Success = false, Message = message, Errors = errors };
}
