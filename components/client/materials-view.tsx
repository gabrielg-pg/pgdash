"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, FolderOpen, Video, Play } from "lucide-react"

interface MaterialsViewProps {
  driveLink: string | null
}

export function MaterialsView({ driveLink }: MaterialsViewProps) {
  const videoTutorials = [
    { 
      title: "Tutoriais Shopify", 
      description: "Aprenda a manusear sua operação na Shopify", 
      link: "https://drive.google.com/drive/folders/12CoLjhu7Nf0LWNWBZohJ2GjMddNPmd3d" 
    },
    { 
      title: "Como Mapear o Produto com Fornecedor", 
      description: "Aprenda a mapear seus produtos assim que vender e realizar o envio diretamente para seus clientes", 
      link: "https://drive.google.com/drive/folders/1z_MOAy4fkuxQI9U6T-MaN_9uLvsjD3HB" 
    },
  ]

  return (
    <div className="space-y-6">
      {/* Seção de Vídeos */}
      <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#6D28D9] flex items-center justify-center shrink-0">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-[#F5F5F7]">Vídeos</CardTitle>
              <CardDescription className="text-[rgba(245,245,247,0.52)]">
                Tutoriais e materiais de apoio em vídeo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {/* Vídeo de Boas-Vindas */}
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-xl aspect-video rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
              <iframe
                title="vimeo-player"
                src="https://player.vimeo.com/video/1170383497?h=ce7013180f"
                width="100%"
                height="100%"
                frameBorder="0"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {videoTutorials.map((video, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-[#171723] rounded-xl border border-[rgba(255,255,255,0.06)] hover:border-[rgba(168,85,247,0.35)] transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-[#0D0D12] flex items-center justify-center shrink-0 border border-[rgba(255,255,255,0.06)]">
                  <Play className="w-6 h-6 text-[#A855F7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#F5F5F7]">{video.title}</p>
                  <p className="text-sm text-[rgba(245,245,247,0.52)]">{video.description}</p>
                </div>
                <Button
                  onClick={() => window.open(video.link, "_blank")}
                  className="bg-[#A855F7] hover:bg-[#9333EA] text-white shrink-0"
                >
                  Clique aqui
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seção do Drive */}
      <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-[#F5F5F7]">Google Drive</CardTitle>
              <CardDescription className="text-[rgba(245,245,247,0.52)]">
                Acesse sua pasta compartilhada com todos os materiais
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {driveLink ? (
            <Button
              onClick={() => window.open(driveLink, "_blank")}
              className="w-full h-16 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white rounded-xl text-lg font-semibold"
            >
              <ExternalLink className="w-5 h-5 mr-3" />
              Abrir Google Drive
            </Button>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-[#171723] flex items-center justify-center mb-4">
                <FolderOpen className="w-7 h-7 text-[rgba(245,245,247,0.52)]" />
              </div>
              <h3 className="text-lg font-medium text-[#F5F5F7] mb-2">Drive não configurado</h3>
              <p className="text-[rgba(245,245,247,0.52)] text-center max-w-md text-sm">
                O link do Google Drive ainda não foi configurado para sua conta.
                Entre em contato com o administrador para solicitar acesso.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
