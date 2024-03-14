export enum GroupTokens {
    SPORTS = "SPORTS",
    MUSIC = "MUSIC",
    MOVIES = "MOVIES",
    GAMING = "GAMING",
    TRAVEL = "TRAVEL",
    FOOD = "FOOD",
    TECHNOLOGY = "TECHNOLOGY",
    FITNESS = "FITNESS",
    BOOKS = "BOOKS",
    FASHION = "FASHION",
    PHOTOGRAPHY = "PHOTOGRAPHY",
    COOKING = "COOKING",
    POLITICS = "POLITICS",
    SCIENCE = "SCIENCE",
    ART = "ART",
    PETS = "PETS",
    BUSINESS = "BUSINESS",
    EDUCATION = "EDUCATION",
    HEALTH = "HEALTH",
    NATURE = "NATURE",
    HISTORY = "HISTORY",
    DIY = "DIY",
    ENTERTAINMENT = "ENTERTAINMENT",
    GARDENING = "GARDENING",
    PARENTING = "PARENTING",
    RELATIONSHIPS = "RELATIONSHIPS",
    RELIGION = "RELIGION",
    TVSHOWS = "TVSHOWS",
    CARS = "CARS",
    HIKING = "HIKING",
    OUTDOORS = "OUTDOORS",
    SHOPPING = "SHOPPING",
    FINANCE = "FINANCE",
    DESIGN = "DESIGN",
    COMEDY = "COMEDY",
    ANIME = "ANIME",
    YOGA = "YOGA",
    DANCE = "DANCE",
    CRAFTS = "CRAFTS",
    CYCLING = "CYCLING",
    PROGRAMMING = "PROGRAMMING",
    WRITING = "WRITING",
    TRAVELING = "TRAVELING",
    NEWS = "NEWS",
    BEAUTY = "BEAUTY",
    ENVIRONMENT = "ENVIRONMENT",
    ASTRONOMY = "ASTRONOMY",
    PARANORMAL = "PARANORMAL",
    PHILOSOPHY = "PHILOSOPHY",
    PSYCHOLOGY = "PSYCHOLOGY",
    SPIRITUALITY = "SPIRITUALITY",
    SELFIMPROVEMENT = "SELFIMPROVEMENT",
    MENTALHEALTH = "MENTALHEALTH",
    LOVE = "LOVE",
    FRIENDSHIP = "FRIENDSHIP",
    GRIEF = "GRIEF",
    HOPE = "HOPE",
    ANGER = "ANGER",
    ANXIETY = "ANXIETY",
    DEPRESSION = "DEPRESSION",
    HAPPINESS = "HAPPINESS",
    STRESS = "STRESS",
    LONELINESS = "LONELINESS",
    FEAR = "FEAR",
    FORGIVENESS = "FORGIVENESS",
    ACCEPTANCE = "ACCEPTANCE",
    EMPATHY = "EMPATHY",
    GRATITUDE = "GRATITUDE",
    COMPASSION = "COMPASSION",
    RESILIENCE = "RESILIENCE",
    TRUST = "TRUST",
    COMMUNICATION = "COMMUNICATION",
    KINDNESS = "KINDNESS",
    MOTIVATION = "MOTIVATION",
    INSPIRATION = "INSPIRATION",
    ENCOURAGEMENT = "ENCOURAGEMENT",
    MEDITATION = "MEDITATION",
    MINDFULNESS = "MINDFULNESS",
    REFLECTION = "REFLECTION",
    DREAMING = "DREAMING",
    ADVENTURE = "ADVENTURE",
    DISCOVERY = "DISCOVERY",
    NOSTALGIA = "NOSTALGIA",
    CREATIVITY = "CREATIVITY",
    CURIOSITY = "CURIOSITY",
    SIMPLICITY = "SIMPLICITY",
    FREEDOM = "FREEDOM",
    JUSTICE = "JUSTICE",
    EQUALITY = "EQUALITY",
    ETHICS = "ETHICS",
    LEADERSHIP = "LEADERSHIP",
    INNOVATION = "INNOVATION",
    CHANGE = "CHANGE",
    COMMUNITY = "COMMUNITY",
    DIVERSITY = "DIVERSITY",
    INCLUSION = "INCLUSION",
    SUSTAINABILITY = "SUSTAINABILITY",
    PRIVATE = "PRIVATE"
}


export enum MESSAGE_CONTENT_TYPE {
    TEXT,
    IMAGE
}


export enum reqType {
    get = "GET",
    post = "POST",
    put = "PUT",
    delete = 'DELETE'
}

export enum serviceRoute {
    login = '/auth/login',
    register = '/auth/register',
    session = '/auth/session',
    groupById = '/group',
    group = '/group',
    user = '/user',
    _groupMessages = '/group/messages',
    groupUsers = '/group/users',
    groupInvite = '/group/invite',
    request = '/group/request',
    groupRole = '/group/role',
    removeUserFromGroup = '/group/remove',
    userRequest = '/group/requests',
    search = '/group/search',
    socialLogin = '/auth/social-login',
    consent = '/user/consent',
    updateInvite = '/group/invite',
    groupReminder = '/group/reminder'
}

export enum service {
    authentication = 'http://localhost:8999/v1',
    group = 'http://localhost:8901/v1',
    messaging = 'http://localhost:8900'
}

export enum EwindowSizes {
    Xl = "Xl",
    M = "M",
    S = "S",
}

export type windowSize = "Xl" | "M" | "S";

export type sidePanelType = "Group" | "Util";

export enum EsidePanel {
    group = "Group", utit = "Util",
}

export enum ClientRole{
    OWNER = 'OWNER',
    ADMIN = 'AIDER',
    MEMBER = 'MEMBER'
}