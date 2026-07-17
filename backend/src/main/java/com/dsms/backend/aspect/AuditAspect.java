package com.dsms.backend.aspect;

import com.dsms.backend.annotation.AuditAction;
import com.dsms.backend.domain.AuditLog;
import com.dsms.backend.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;

@Aspect
@Component
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    public AuditAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @AfterReturning(pointcut = "@annotation(com.dsms.backend.annotation.AuditAction)", returning = "result")
    public void logAuditActivity(JoinPoint joinPoint, Object result) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        AuditAction auditAction = method.getAnnotation(AuditAction.class);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (auth != null && auth.getName() != null) ? auth.getName() : "SYSTEM";

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String ipAddress = request.getRemoteAddr();

        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setAction(auditAction.action());
        log.setEntityName(auditAction.entityName());
        log.setIpAddress(ipAddress);
        
        // In a real app we might serialize the args or result to JSON, skipping for brevity
        log.setDetails("Method executed: " + method.getName());

        auditLogRepository.save(log);
    }
}
