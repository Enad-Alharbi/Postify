using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Postify.Api.Extensions;

public static class AuthenticationExtension
{
public static void AddAuthentication(this WebApplicationBuilder builder)
{
    var jwtIssuer = builder.Configuration["Jwt:Issuer"];
    var jwtAudience = builder.Configuration["Jwt:Audience"];
    var jwtSecretKey = builder.Configuration["Jwt:SecretKey"];

    if (string.IsNullOrWhiteSpace(jwtIssuer))
        throw new InvalidOperationException("JWT Issuer is missing.");

    if (string.IsNullOrWhiteSpace(jwtAudience))
        throw new InvalidOperationException("JWT Audience is missing.");

    if (string.IsNullOrWhiteSpace(jwtSecretKey))
        throw new InvalidOperationException("JWT SecretKey is missing.");

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtIssuer,

                ValidateAudience = true,
                ValidAudience = jwtAudience,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtSecretKey)
                )
            };
        });
}
}
