using Microsoft.OpenApi.Models;
using NexusVerde.Application.Mapping;
using NexusVerde.Infrastructure;
using NexusVerde.Application.Interfaces;
using NexusVerde.Application.Services;
using NexusVerde.Infrastructure.Repositories;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Configuração de CORS para desenvolvimento
// Necessário para Android, navegadores e clientes externos acessarem a API
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevelopmentPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Nexus Verde — API de Monitoramento Ambiental",
        Description = "API REST para monitoramento de florestas e áreas ambientais usando dados satelitais, análise espectral (NDVI) e alertas de risco. Projeto Nexus Verde — Monitoramento Ambiental com Dados Satelitais.",
        Contact = new OpenApiContact
        {
            Name = "Equipe Nexus Verde",
            Url = new Uri("https://www.nexusverde.com/monitoring")
        }
    });

    var xmlPath = Path.Combine(AppContext.BaseDirectory, "NexusVerde.WebAPI.xml");
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Environmental monitoring services registration
builder.Services.AddScoped<IRegiaoMonitoradaService, RegiaoMonitoradaService>();
builder.Services.AddScoped<IFonteSatelitalService, FonteSatelitalService>();
builder.Services.AddScoped<IImagemSatelitalService, ImagemSatelitalService>();
builder.Services.AddScoped<IAnaliseAmbientalService, AnaliseAmbientalService>();
builder.Services.AddScoped<IAlertaAmbientalService, AlertaAmbientalService>();
builder.Services.AddScoped<IHistoricoMonitoramentoService, HistoricoMonitoramentoService>();
builder.Services.AddScoped<IEnvironmentalRiskService, EnvironmentalRiskService>();
builder.Services.AddHttpClient<ISentinelHubService, SentinelHubService>();
// Image analysis service (simple local processing)
builder.Services.AddScoped<IImageAnalysisService, ImageAnalysisService>();
// Image analysis service with persistence
builder.Services.AddScoped<IAnaliseImagemAmbientalRepository, AnaliseImagemAmbientalRepository>();
builder.Services.AddScoped<IAnaliseImagemAmbientalService, AnaliseImagemAmbientalService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Nexus Verde API v1");
        // Serve Swagger UI at application root (/) in Development
        c.RoutePrefix = string.Empty;
    });
}

// Ativar CORS para desenvolvimento
app.UseCors("DevelopmentPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

app.Run();

