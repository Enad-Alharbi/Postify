namespace TaskatiApp.Data;

public static class CorsExtension
{
    const string localAngularOrigin = "http://localhost:4200";
    const string localAngularPolicy = "AllowAngular";

    public static void AddAngularCorsPolicy(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(localAngularPolicy, policy =>
            {
                policy.WithOrigins(localAngularOrigin)
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });
    }

    public static void UseAngularCorsPolicy(this WebApplication app)
    {
        app.UseCors(localAngularPolicy);
    }
}
