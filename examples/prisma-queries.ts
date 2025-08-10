import { prisma } from '../lib/db';

/**
 * Ten plik zawiera przykłady zapytań do bazy danych przy użyciu Prismy.
 * Możesz go użyć jako referencji podczas migracji z Drizzle na Prismę.
 */

// Przykład 1: Pobieranie wszystkich partnerów
async function getAllPartners() {
  const partners = await prisma.partner.findMany();
  return partners;
}

// Przykład 2: Pobieranie partnera po ID
async function getPartnerById(id: string) {
  const partner = await prisma.partner.findUnique({
    where: { id },
  });
  return partner;
}

// Przykład 3: Pobieranie partnera po emailu
async function getPartnerByEmail(email: string) {
  const partner = await prisma.partner.findUnique({
    where: { email },
  });
  return partner;
}

// Przykład 4: Tworzenie nowego partnera
async function createPartner(data: {
  accountType: 'company' | 'individual';
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  company?: string;
  address?: string;
  referralCode: string;
  referredById?: string;
}) {
  const partner = await prisma.partner.create({
    data,
  });
  return partner;
}

// Przykład 5: Aktualizacja partnera
async function updatePartner(id: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  isActive?: number;
  isVerified?: number;
}) {
  const partner = await prisma.partner.update({
    where: { id },
    data,
  });
  return partner;
}

// Przykład 6: Usuwanie partnera
async function deletePartner(id: string) {
  await prisma.partner.delete({
    where: { id },
  });
}

// Przykład 7: Pobieranie wszystkich leadów dla partnera
async function getLeadsByPartnerId(partnerId: string) {
  const leads = await prisma.lead.findMany({
    where: { partnerId },
  });
  return leads;
}

// Przykład 8: Pobieranie leada wraz z historią
async function getLeadWithHistory(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { history: true },
  });
  return lead;
}

// Przykład 9: Tworzenie nowego leada z historią
async function createLeadWithHistory(leadData: {
  partnerId: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'new' | 'in_progress' | 'completed' | 'rejected';
  value?: string;
  source?: string;
  notes?: string;
}) {
  // Transakcja zapewnia, że zarówno lead jak i historia zostaną zapisane razem
  const result = await prisma.$transaction(async (tx) => {
    // Utwórz lead
    const lead = await tx.lead.create({
      data: {
        ...leadData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Dodaj wpis do historii
    const history = await tx.leadHistory.create({
      data: {
        leadId: lead.id,
        action: 'Utworzenie leada',
        user: 'System',
        createdAt: new Date(),
      },
    });

    return { lead, history };
  });

  return result;
}

// Przykład 10: Aktualizacja statusu leada z dodaniem wpisu do historii
async function updateLeadStatus(leadId: string, newStatus: 'new' | 'in_progress' | 'completed' | 'rejected', userName: string) {
  const result = await prisma.$transaction(async (tx) => {
    // Aktualizuj status leada
    const lead = await tx.lead.update({
      where: { id: leadId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    // Dodaj wpis do historii
    const history = await tx.leadHistory.create({
      data: {
        leadId,
        action: `Zmiana statusu na "${newStatus}"`,
        user: userName,
        createdAt: new Date(),
      },
    });

    return { lead, history };
  });

  return result;
}

// Przykład 11: Pobieranie statystyk leadów dla partnera
async function getLeadStatsByPartnerId(partnerId: string) {
  const totalLeads = await prisma.lead.count({
    where: { partnerId },
  });

  const leadsByStatus = await prisma.lead.groupBy({
    by: ['status'],
    where: { partnerId },
    _count: { id: true },
  });

  return {
    totalLeads,
    leadsByStatus,
  };
}

// Przykład 12: Pobieranie partnerów z ich powiadomieniami
async function getPartnersWithNotifications() {
  const partners = await prisma.partner.findMany({
    include: { notifications: true },
  });
  return partners;
}

// Przykład 13: Aktualizacja ustawień powiadomień partnera
async function updatePartnerNotifications(partnerId: string, data: {
  emailNewLeads?: number;
  emailLeadUpdates?: number;
  emailPartnerProgram?: number;
  emailMarketing?: number;
}) {
  const notification = await prisma.partnerNotification.update({
    where: { partnerId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
  return notification;
}

// Przykład 14: Pobieranie partnerów poleconych przez danego partnera
async function getReferredPartners(referrerId: string) {
  const referredPartners = await prisma.partner.findMany({
    where: { referredById: referrerId },
  });
  return referredPartners;
}

// Przykład 15: Złożone zapytanie - pobieranie partnerów z ich leadami i statystykami
async function getPartnersWithLeadsAndStats() {
  const partners = await prisma.partner.findMany({
    include: {
      leads: true,
      notifications: true,
      referredPartners: true,
    },
  });

  // Obliczanie statystyk dla każdego partnera
  const partnersWithStats = await Promise.all(
    partners.map(async (partner) => {
      const leadStats = await getLeadStatsByPartnerId(partner.id);
      return {
        ...partner,
        leadStats,
      };
    })
  );

  return partnersWithStats;
}

export {
  getAllPartners,
  getPartnerById,
  getPartnerByEmail,
  createPartner,
  updatePartner,
  deletePartner,
  getLeadsByPartnerId,
  getLeadWithHistory,
  createLeadWithHistory,
  updateLeadStatus,
  getLeadStatsByPartnerId,
  getPartnersWithNotifications,
  updatePartnerNotifications,
  getReferredPartners,
  getPartnersWithLeadsAndStats,
};