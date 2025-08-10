"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Send } from "lucide-react"
import { useForm, type SubmitHandler, Controller } from "react-hook-form"
import { motion } from "framer-motion"
import { AnimatedElement } from "./animations/animated-element" // Adjusted path
import { NotificationModal } from "@/components/ui/notification-modal"
import { useState } from "react"


type Inputs = {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  investmentName?: string
  interestArea_3d: boolean
  interestArea_virtualTours: boolean
  interestArea_interiorDesign: boolean
  interestArea_homeStaging: boolean
  interestArea_partnerProgram: boolean
  message: string
  agreement: boolean
}

export default function ContactSection() {
  // State for notification modal
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      investmentName: "",
      interestArea_3d: false,
      interestArea_virtualTours: false,
      interestArea_interiorDesign: false,
      interestArea_homeStaging: false,
      interestArea_partnerProgram: false,
      message: "",
      agreement: false,
    },
    mode: "onSubmit"
  })

  // Form is managed by react-hook-form, no need for additional state

  const handleSubmitForm: SubmitHandler<Inputs> = async (data) => {
    try {
      // Show loading state through isSubmitting
      console.log("Form data being submitted:", data);
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Wystąpił błąd podczas wysyłania wiadomości');
      }
      
      // Show success notification
      setNotificationMessage('Twoja wiadomość została wysłana. Skontaktujemy się z Tobą wkrótce!');
      setShowNotification(true);
      
      // Reset the form to initial values
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error notification
      setNotificationMessage(`Wystąpił błąd: ${error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości'}`);
      setShowNotification(true);
    }
  }

  const interestAreas = [
    { id: "3d-visuals", name: "interestArea_3d", label: "Wizualizacje 3D" },
    { id: "virtual-tours", name: "interestArea_virtualTours", label: "Wirtualne spacery" },
    { id: "interior-design", name: "interestArea_interiorDesign", label: "Projektowanie wnętrz" },
    { id: "home-staging", name: "interestArea_homeStaging", label: "Home Staging" },
    { id: "partner-program-contact", name: "interestArea_partnerProgram", label: "Program Partnerski" },
  ] as const

  // Function to open the privacy policy modal from the parent component
  const openPrivacyPolicy = (e: React.MouseEvent) => {
    e.preventDefault()
    // We'll use a custom event to communicate with the parent component
    const event = new CustomEvent('openPrivacyPolicy', { bubbles: true })
    document.dispatchEvent(event)
  }

  return (
    <>
      {/* Notification Modal */}
      <NotificationModal 
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />
      
      <section id="contact" className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-background">
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src="/images/architectural-sketch-bg.jpg"
          alt="Tło ze szkicami architektonicznymi"
          fill
          className="object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-background/95" />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-8 block sm:hidden">
          <h2 className="text-2xl font-heading-medium text-foreground">Kontakt</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#b38a34] to-[#9a7529] mx-auto rounded-full mt-2"></div>
        </div>
        
        <AnimatedElement
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
          }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl grid lg:grid-cols-5 border border-border">
            <div className="hidden lg:block lg:col-span-2 relative bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-primary-foreground p-8 md:p-12 flex flex-col justify-between min-h-[500px] overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="/images/351204.jpg"
                  alt="Eleganckie wnętrze"
                  fill
                  style={{ objectFit: "cover" }}
                  className="opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#b38a34]/80 to-[#9a7529]/70 mix-blend-color"></div>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl mb-4 text-white font-heading-medium tracking-wide">Kontakt</h3>
                <p className="text-base text-white font-body-regular">Jesteśmy gotowi odpowiedzieć na Twoje pytania.</p>
              </div>
              <div className="relative z-10 space-y-6 mt-8">
                {[
                  { icon: <Phone className="h-5 w-5 mr-4 flex-shrink-0 text-white" />, text: "+48 530 002 009" },
                  { icon: <Mail className="h-5 w-5 mr-4 flex-shrink-0 text-white" />, text: "kontakt@artscore.pro" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center group">
                    {item.icon}
                    <span className="text-base font-body-medium text-white transition-colors group-hover:text-white/90">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-5 lg:col-span-3 bg-card text-card-foreground p-6 sm:p-8 md:p-12">

              <p className="p mb-6 sm:mb-8 font-body-regular">
                Wypełnij formularz, a nasz specjalista skontaktuje się z Tobą, aby omówić Twoje potrzeby i przedstawić
                dopasowane rozwiązania.
              </p>
              
              {/* Contact info for mobile */}
              <div className="flex flex-col space-y-3 mb-6 sm:hidden">
                {[
                  { icon: <Phone className="h-4 w-4 mr-3 flex-shrink-0 text-[#b38a34]" />, text: "+48 530 002 009" },
                  { icon: <Mail className="h-4 w-4 mr-3 flex-shrink-0 text-[#b38a34]" />, text: "kontakt@artscore.pro" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center group">
                    {item.icon}
                    <span className="text-sm font-body-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="companyName" className="text-foreground font-body-medium">
                      Nazwa firmy
                    </Label>
                    <Input
                      id="companyName"
                      {...register("companyName", { required: "Nazwa firmy jest wymagana" })}
                      className="mt-1 bg-background border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-[#b38a34]"
                      placeholder="Twoja firma Sp. z o.o."
                    />
                    {errors.companyName && <p className="text-sm text-red-500 mt-1 font-body-regular">{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="contactPerson" className="text-foreground font-body-medium">
                      Osoba kontaktowa
                    </Label>
                    <Input
                      id="contactPerson"
                      {...register("contactPerson", { required: "Osoba kontaktowa jest wymagana" })}
                      className="mt-1 bg-background border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-[#b38a34]"
                      placeholder="Jan Kowalski"
                    />
                    {errors.contactPerson && (
                      <p className="text-sm text-red-500 mt-1 font-body-regular">{errors.contactPerson.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="email" className="text-foreground font-body-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email jest wymagany",
                        pattern: { value: /^\S+@\S+$/i, message: "Nieprawidłowy format email" },
                      })}
                      className="mt-1 bg-background border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-[#b38a34]"
                      placeholder="jan.kowalski@example.com"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1 font-body-regular">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-foreground font-body-medium">
                      Telefon
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone", { required: "Telefon jest wymagany" })}
                      className="mt-1 bg-background border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-[#b38a34]"
                      placeholder="+48 500 000 000"
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1 font-body-regular">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <Label className="text-foreground font-body-medium">Obszary zainteresowania</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-2">
                    {interestAreas.map((area) => (
                      <div key={area.id} className="flex items-center space-x-2">
                        <Controller
                          name={area.name}
                          control={control}
                          defaultValue={false}
                          render={({ field }) => (
                            <>
                              <Checkbox
                                id={area.id}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-border data-[state=checked]:bg-[#b38a34] data-[state=checked]:border-[#b38a34] data-[state=checked]:text-white"
                              />
                              <Label 
                                htmlFor={area.id} 
                                className="font-body-regular text-sm text-muted-foreground"
                                onClick={() => field.onChange(!field.value)}
                              >
                                {area.label}
                              </Label>
                            </>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="text-foreground font-body-medium">
                    Wiadomość
                  </Label>
                  <Textarea
                    id="message"
                    {...register("message", { required: "Wiadomość jest wymagana" })}
                    rows={4}
                    className="mt-1 bg-background border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-[#b38a34]"
                    placeholder="Opisz swoje potrzeby lub zadaj pytanie..."
                  />
                  {errors.message && <p className="text-sm text-red-500 mt-1 font-body-regular">{errors.message.message}</p>}
                </div>
                <div className="pt-2">
                  <Controller
                    name="agreement"
                    control={control}
                    rules={{ required: "Zgoda jest wymagana" }}
                    render={({ field }) => (
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreement"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 border-border data-[state=checked]:bg-[#b38a34] data-[state=checked]:border-[#b38a34] data-[state=checked]:text-white"
                        />
                        <Label htmlFor="agreement" className="text-xs font-body-regular text-muted-foreground" onClick={() => field.onChange(!field.value)}>
                          Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{" "}
                          <Link href="/privacy-policy" className="underline hover:text-[#b38a34]" onClick={openPrivacyPolicy}>
                            Polityką Prywatności
                          </Link>
                          .
                        </Label>
                      </div>
                    )}
                  />
                  {errors.agreement && <p className="text-sm text-red-500 mt-1 font-body-regular">{errors.agreement.message}</p>}
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white py-6 rounded-xl font-body-semibold transition-all duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Wysyłanie...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Wyślij zapytanie</span>
                        <Send className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
    </>
  )
}
