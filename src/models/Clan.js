const { db } = require('../config/firebase');
const { doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');

class Clan {
    static async getClan() {
        const clanRef = doc(db, 'clans', 'CYEX');
        const clanDoc = await getDoc(clanRef);
        
        if (!clanDoc.exists()) {
            const newClan = {
                name: 'CYEX',
                totalMoney: 0,
                transactions: []
            };
            await setDoc(clanRef, newClan);
            return newClan;
        }
        
        return clanDoc.data();
    }

    static async updateMoney(amount, description, userId, username) {
        const clan = await this.getClan();
        const newTransaction = {
            amount,
            description,
            userId,
            username,
            date: new Date().toISOString()
        };

        await updateDoc(doc(db, 'clans', 'CYEX'), {
            totalMoney: clan.totalMoney + amount,
            transactions: [...clan.transactions, newTransaction]
        });

        return newTransaction;
    }

    static async getRecentTransactions(limit = 5) {
        const clan = await this.getClan();
        return clan.transactions.slice(-limit).reverse();
    }
}

module.exports = Clan; 