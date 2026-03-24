'use client'
import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { MockQuestion } from '@/lib/mock-data'

interface Props {
  question: MockQuestion
  onAnswer: (a: string[]) => void
}

function SortableItem({ id, index }: { id: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-grab active:cursor-grabbing min-h-[48px] shadow-sm"
    >
      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-medium shrink-0">
        {index + 1}
      </span>
      <span className="flex-1 text-sm text-slate-700">{id}</span>
      <GripVertical size={16} className="text-slate-400 shrink-0" {...attributes} {...listeners} />
    </div>
  )
}

export default function QuestionDragDrop({ question, onAnswer }: Props) {
  const { t } = useTranslation()
  const [items, setItems] = useState<string[]>(question.items ?? [])
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string)
      const newIndex = items.indexOf(over.id as string)
      const next = arrayMove(items, oldIndex, newIndex)
      setItems(next)
      onAnswer(next)
    }
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item, i) => (
            <SortableItem key={item} id={item} index={i} />
          ))}
        </SortableContext>
      </DndContext>
      <p className="text-xs text-slate-400 mt-2">{t('test_questions_dragdrop_hint')}</p>
    </div>
  )
}
