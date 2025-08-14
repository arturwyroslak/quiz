"use client"

import { useState } from 'react';
import { Question as QuestionType } from "@prisma/client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

// A more detailed Question type for the frontend
type ClientQuestion = QuestionType & {
    options?: any;
};

interface QuestionProps {
    question: ClientQuestion;
    onAnswer: (answer: any) => void;
}

export const QuestionComponent = ({ question, onAnswer }: QuestionProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [sliderValue, setSliderValue] = useState<number[]>([question.options?.min ?? 1]);
    const [textValue, setTextValue] = useState<string>('');

    const renderQuestionType = () => {
        switch (question.type) {
            case 'single-choice':
                return (
                    <RadioGroup onValueChange={setSelectedOption} value={selectedOption ?? undefined}>
                        {question.options?.choices?.map((opt: any) => (
                            <div key={opt.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt.value} id={opt.value} />
                                <Label htmlFor={opt.value}>{opt.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            case 'multiple-choice':
                return (
                    <div>
                        {question.options?.choices?.map((opt: any) => (
                            <div key={opt.value} className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                    id={opt.value}
                                    checked={selectedOptions.includes(opt.value)}
                                    onCheckedChange={(checked) => {
                                        const newSelection = checked
                                            ? [...selectedOptions, opt.value]
                                            : selectedOptions.filter(v => v !== opt.value);
                                        setSelectedOptions(newSelection);
                                    }}
                                />
                                <Label htmlFor={opt.value}>{opt.label}</Label>
                            </div>
                        ))}
                    </div>
                );

            case 'slider':
                return (
                    <div className="py-4">
                        <Slider
                            min={question.options?.min ?? 1}
                            max={question.options?.max ?? 5}
                            step={question.options?.step ?? 1}
                            value={sliderValue}
                            onValueChange={setSliderValue}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            {question.options?.referencePoints?.map((pt: any) => (
                                <span key={pt.value}>{pt.label}</span>
                            ))}
                        </div>
                    </div>
                );

            case 'text':
                return (
                    <Textarea
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder={question.options?.placeholder ?? 'Wpisz swoją odpowiedź...'}
                    />
                );

            case 'image-choice':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {question.options?.choices?.map((opt: any) => (
                             <div
                                key={opt.value}
                                className={`border-2 rounded-lg p-2 cursor-pointer ${selectedOption === opt.value ? 'border-primary' : ''}`}
                                onClick={() => setSelectedOption(opt.value)}
                            >
                                <div className="relative w-full h-40">
                                    <Image src={opt.imageUrl} alt={opt.label} layout="fill" objectFit="cover" className="rounded"/>
                                </div>
                                <p className="text-center mt-2 font-medium">{opt.label}</p>
                            </div>
                        ))}
                    </div>
                );

            case 'trade-off':
                return (
                    <div className="flex gap-4">
                        <Button className="flex-1 h-auto" variant="outline" onClick={() => onAnswer(question.options.optionA.value)}>
                            <div className="flex flex-col p-4">
                                <h4 className="font-bold">{question.options.optionA.label}</h4>
                                <p className="text-sm text-muted-foreground">{question.options.optionA.description}</p>
                            </div>
                        </Button>
                        <Button className="flex-1 h-auto" variant="outline" onClick={() => onAnswer(question.options.optionB.value)}>
                            <div className="flex flex-col p-4">
                                <h4 className="font-bold">{question.options.optionB.label}</h4>
                                <p className="text-sm text-muted-foreground">{question.options.optionB.description}</p>
                            </div>
                        </Button>
                    </div>
                );

            default:
                return <p>Nieobsługiwany typ pytania: {question.type}</p>;
        }
    };

    const handleSubmit = () => {
        let answer: any = null;
        switch (question.type) {
            case 'single-choice':
            case 'image-choice':
                answer = selectedOption;
                break;
            case 'multiple-choice':
                answer = selectedOptions;
                break;
            case 'slider':
                answer = sliderValue[0];
                break;
            case 'text':
                answer = textValue;
                break;
        }
        if (answer !== null && answer !== '' && answer.length !== 0) {
            onAnswer(answer);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{question.text}</CardTitle>
                {question.description && <CardDescription>{question.description}</CardDescription>}
            </CardHeader>
            <CardContent>
                {renderQuestionType()}
            </CardContent>
            {question.type !== 'trade-off' && (
                <div className="p-6 pt-0">
                    <Button onClick={handleSubmit}>Dalej</Button>
                </div>
            )}
        </Card>
    );
};

// Exporting the old name for compatibility with functional-quiz.tsx
export type { ClientQuestion as Question };
