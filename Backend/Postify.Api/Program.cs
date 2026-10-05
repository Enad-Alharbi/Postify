using Postify.Api.Data;
using Postify.Api.Extensions;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.AddSwagger();

builder.Services.AddSqlServer<PostifyContext>(builder.Configuration.GetConnectionString("DefaultConnection"));

builder.AddAuthentication();

builder.Services.AddControllers();

builder.RegisterServices();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();