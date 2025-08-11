"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export interface Question {
  id: string;
  text: string;
  type: 'single-choice' | 'multiple-choice' | 'slider';
  options?: string[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
}

interface QuestionProps {
  question: Question;
  onAnswer: (answer: any) => void;
}

export function QuestionComponent({ question, onAnswer }: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [sliderValue, setSliderValue] = useState(question.sliderMin || 0)

  const handleNext = () => {
    if (question.type === 'single-choice') {
      onAnswer(selectedOption)
    } else if (question.type === 'multiple-choice') {
      onAnswer(selectedOptions)
    } else if (question.type === 'slider') {
      onAnswer(sliderValue)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{question.text}</h2>
      <div className="mb-8">
        {question.type === 'single-choice' && question.options && (
          <RadioGroup onValueChange={setSelectedOption}>
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {question.type === 'multiple-choice' && question.options && (
          <div className="flex flex-col space-y-2">
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  onCheckedChange={(checked) => {
                    setSelectedOptions(prev =>
                      checked ? [...prev, option] : prev.filter(o => o !== option)
                    )
                  }}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
        )}
        {question.type === 'slider' && (
          <Slider
            min={question.sliderMin}
            max={question.sliderMax}
            step={question.sliderStep}
            value={[sliderValue]}
            onValueChange={(value) => setSliderValue(value[0])}
          />
        )}
      </div>
      <Button onClick={handleNext}>Dalej</Button>
    </div>
  )
}
