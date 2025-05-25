import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Faq {
  question: string;
  answer: string;
}
@Component({
  selector: 'app-ayuda',
  imports: [FormsModule, CommonModule],
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.css'
})
export class AyudaComponent {
  searchTerm = '';
  faqs: Faq[] = [
    {
      question: '¿Cómo subo un vídeo?',
      answer: 'Solo necesitamos la URL del vídeo de Youtube, dentro de una palabra puedes subir vídeos relativos a ella.',
    },
    {
      question: '¿Quién corrige mis vídeos?',
      answer: 'Otros usuarios pueden corregir tus vídeos, cuando otro usuario dé un motivo de corrección podrás verlo en "Vídeos corregidos". ',
    },
    {
      question: '¿Puedo editar una palabra después de crearla?',
      answer: 'No, solo los moderadores de la página pueden editar palabras. Si encuentras un error, puedes reportarlo.',
    },
    {
      question: '¿Cómo busco una palabra?',
      answer: 'Tienes varias opciones: puedes buscar por la letra inicial, por el nombre de la palabra o por etiquetas asociadas a ella.',
    },
    {
      question: '¿Qué son las etiquetas?',
      answer: 'Son palabras clave que ayudan a categorizar y encontrar vídeos relacionados con una temática específica.',
    },
    {
      question: '¿Cuánto cuesta usar la plataforma?',
      answer: 'Nada. Todo el contenido es gratuito. Solo pedimos tu colaboración compartiendo conocimiento.',
    },
  ];

  /** Devuelve la lista filtrada por el término de búsqueda */
  filteredFaqs(): Faq[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.faqs;
    return this.faqs.filter((faq) =>
      faq.question.toLowerCase().includes(term)
    );
  }
}
