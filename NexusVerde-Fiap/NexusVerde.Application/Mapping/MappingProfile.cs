using AutoMapper;
using NexusVerde.Application.DTOs;
using NexusVerde.Domain.Entities;

namespace NexusVerde.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Environmental Monitoring Mappings
        CreateMap<RegiaoMonitorada, RegiaoMonitoradaDto>();
        CreateMap<CreateRegiaoMonitoradaDto, RegiaoMonitorada>();
        CreateMap<UpdateRegiaoMonitoradaDto, RegiaoMonitorada>();

        CreateMap<FonteSatelital, FonteSatelitalDto>();
        CreateMap<CreateFonteSatelitalDto, FonteSatelital>();
        CreateMap<UpdateFonteSatelitalDto, FonteSatelital>();

        CreateMap<ImagemSatelital, ImagemSatelitalDto>();
        CreateMap<CreateImagemSatelitalDto, ImagemSatelital>();
        CreateMap<UpdateImagemSatelitalDto, ImagemSatelital>();

        CreateMap<AnaliseAmbiental, AnaliseAmbientalDto>();
        CreateMap<CreateAnaliseAmbientalDto, AnaliseAmbiental>();

        CreateMap<AlertaAmbiental, AlertaAmbientalDto>();
        CreateMap<CreateAlertaAmbientalDto, AlertaAmbiental>();
        CreateMap<UpdateAlertaAmbientalDto, AlertaAmbiental>();

        CreateMap<HistoricoMonitoramento, HistoricoMonitoramentoDto>();
        CreateMap<CreateHistoricoMonitoramentoDto, HistoricoMonitoramento>();

        // Análise de Imagem Ambiental Mappings
        CreateMap<AnaliseImagemAmbiental, AnaliseImagemAmbientalResponseDto>();
    }
}


