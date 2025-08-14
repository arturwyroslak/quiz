"use client"

import { useState, useEffect } from 'react';
import { Question as QuestionType } from "@prisma/client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

    // Reset state when question changes
    useEffect(() => {
        setSelectedOption(null);
        setSelectedOptions([]);
        setSliderValue([question.options?.min ?? 1]);
        setTextValue('');
    }, [question]);

    const renderQuestionType = () => {
        switch (question.type) {
            case 'single-choice':
                return (
                    <RadioGroup onValueChange={setSelectedOption} value={selectedOption ?? undefined} className="space-y-3">
                        {question.options?.choices?.map((opt: any) => (
                            <Label key={opt.value} htmlFor={opt.value} className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedOption === opt.value ? 'border-[#b38a34] bg-[#b38a34]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                <RadioGroupItem value={opt.value} id={opt.value} className="text-[#b38a34] border-[#b38a34]" />
                                <span className="font-body-medium text-gray-800">{opt.label}</span>
                            </Label>
                        ))}
                    </RadioGroup>
                );

            case 'multiple-choice':
                return (
                    <div className="space-y-3">
                        {question.options?.choices?.map((opt: any) => (
                            <Label key={opt.value} htmlFor={opt.value} className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedOptions.includes(opt.value) ? 'border-[#b38a34] bg-[#b38a34]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                <Checkbox
                                    id={opt.value}
                                    checked={selectedOptions.includes(opt.value)}
                                    onCheckedChange={(checked) => {
                                        const newSelection = checked
                                            ? [...selectedOptions, opt.value]
                                            : selectedOptions.filter(v => v !== opt.value);
                                        setSelectedOptions(newSelection);
                                    }}
                                    className="h-5 w-5 rounded data-[state=checked]:bg-[#b38a34] data-[state=checked]:border-[#b38a34]"
                                />
                                <span className="font-body-medium text-gray-800">{opt.label}</span>
                            </Label>
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
                            className="[&>span:first-child]:h-3 [&>span:first-child]:w-3 [&>span:first-child]:bg-[#b38a34]"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-4 font-body-regular">
                            {question.options?.referencePoints?.map((pt: any) => (
                                <span key={pt.value} className="w-1/4 text-center">{pt.label}</span>
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
                        className="min-h-[120px] font-body-regular text-base"
                    />
                );

            case 'image-choice':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.options?.choices?.map((opt: any) => (
                             <div
                                key={opt.value}
                                className={`border-2 rounded-lg p-2 cursor-pointer transition-all duration-200 ${selectedOption === opt.value ? 'border-[#b38a34] ring-2 ring-[#b38a34]' : 'border-transparent hover:border-gray-300'}`}
                                onClick={() => setSelectedOption(opt.value)}
                            >
                                <div className="relative w-full h-48 overflow-hidden rounded-md">
                                    <Image src={opt.imageUrl} alt={opt.label} layout="fill" objectFit="cover" className="transition-transform duration-300 hover:scale-105"/>
                                </div>
                                <p className="text-center mt-3 font-body-semibold text-gray-800">{opt.label}</p>
                            </div>
                        ))}
                    </div>
                );

            case 'trade-off':
                return (
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button className="flex-1 h-auto text-left whitespace-normal" variant="outline" onClick={() => onAnswer(question.options.optionA.value)}>
                            <div className="flex flex-col p-4">
                                <h4 className="font-heading-semibold text-base">{question.options.optionA.label}</h4>
                                <p className="text-sm text-muted-foreground font-body-regular mt-1">{question.options.optionA.description}</p>
                            </div>
                        </Button>
                        <Button className="flex-1 h-auto text-left whitespace-normal" variant="outline" onClick={() => onAnswer(question.options.optionB.value)}>
                             <div className="flex flex-col p-4">
                                <h4 className="font-heading-semibold text-base">{question.options.optionB.label}</h4>
                                <p className="text-sm text-muted-foreground font-body-regular mt-1">{question.options.optionB.description}</p>
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
        if (answer !== null && answer !== '' && (Array.isArray(answer) ? answer.length > 0 : true)) {
            onAnswer(answer);
        }
    };

    return (
        <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <Card className="w-full mx-auto border-gray-200/80 shadow-sm bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-heading-semibold text-xl">{question.text}</CardTitle>
                    {question.description && <CardDescription className="font-body-regular text-base pt-2">{question.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                    {renderQuestionType()}
                </CardContent>
                {question.type !== 'trade-off' && (
                    <CardFooter className="flex justify-end pt-4">
                        <Button
                          onClick={handleSubmit}
                          size="lg"
                          className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-8 py-3 text-base rounded-xl font-body-semibold shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Dalej
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    );
};

export type { ClientQuestion as Question };
