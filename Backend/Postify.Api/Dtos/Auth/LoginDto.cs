namespace Postify.Api.Dtos;

public record LoginDto(
    string EmailOrUserName,
    string Password
);
